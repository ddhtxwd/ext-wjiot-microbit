#include "wjiot.h"
#include "basic.h"


WJIOT *myWJIOT;
void mqttTick(MicroBitEvent e);
MsgHandleCb wifi_conneted=NULL;
MsgHandleCb mqtt_conneted=NULL;


WJIOT::WJIOT()
{
    myWJIOT=this;
}

WJIOT::~WJIOT()
{
    
}


void WJIOT::serialInit(uint8_t receive, uint8_t send)
{
    receive = g_PinID[receive];
    send = g_PinID[send];
    MicroBitPin *rxpin = getMicroBitPin(receive);
    MicroBitPin *txpin = getMicroBitPin(send);
#if defined(NRF5)
    uBit.serial.redirect(txpin->name, rxpin->name);
    uBit.serial.baud((int)115200);
#elif defined(NRF52833)
    uBit.serial.redirect(*txpin, *rxpin);
    uBit.serial.setBaudrate((int)115200);
#endif

    uBit.serial.setTxBufferSize(300);
    uBit.serial.setRxBufferSize(300);
    uBit.serial.eventOn(ManagedString('\n'), MicroBitSerialMode::ASYNC);
#if defined(NRF5)
    uBit.messageBus.listen(32, 1, mqttTick);
#elif defined(NRF52833)
    uBit.messageBus.listen(DEVICE_ID_SERIAL, CODAL_SERIAL_EVT_DELIM_MATCH, mqttTick);
#endif
    uBit.serial.clearRxBuffer();
    uBit.serial.clearTxBuffer();
}

void WJIOT::begin()
{
	serialInit(14, 13);
}

void WJIOT::begin(uint8_t send, uint8_t receive)
{
	serialInit(receive, send);
}

void WJIOT::WIFI_connect(const String &ssid,const String &pass)
{
	is_wifi_conneted==false;
	delay(10);
	String msg = "AT+XMU_WIFI=" + ssid + ',' + pass + '\n';
	while(is_wifi_conneted==false){
		uBit.serial.send(msg.c_str());
		long start_time = millis();
		while(millis() - start_time < 5000){
			delay(100);
			if(is_wifi_conneted){
				String o;
				if (wifi_conneted!=NULL) wifi_conneted(o);
				break;
			}
		}
	}
}

void WJIOT::OneNET_connect(const String &product_id,const String &machine_id,const String &pass)
{
	is_mqtt_conneted=false;
	delay(10);
	String msg = "AT+ONENET=" + product_id + ',' + machine_id + ',' + pass + '\n';
	while(is_mqtt_conneted==false){
		uBit.serial.send(msg.c_str());
		long start_time = millis();
		while(millis() - start_time < 5000){
			delay(100);
			if(is_mqtt_conneted){
				String o;
				if (mqtt_conneted!=NULL) mqtt_conneted(o);
				break;
			}
		}
	}
}

void WJIOT::OneNET_send(const String &data_id,const String &data_value)
{
	if(is_mqtt_conneted==false)return;
    String msg = "AT+ON_SEND=" + data_id + ',' + data_value + '\n';
	uBit.serial.send(msg.c_str());
    delay(100);
}
String WJIOT::get_value()
{
	return receive_value;
}
void WJIOT::on_wifi_connected(const MsgHandleCb handle)
{
	wifi_conneted = handle;
}
void WJIOT::on_mqtt_connected(const MsgHandleCb handle)
{
	mqtt_conneted = handle;
}
void WJIOT::on_mqtt_receiveed(const MsgHandleCb handle){
    myWJIOT->mqtt_received = handle;
}
void WJIOT::OneNET_subscribe(const String &data_id){
	if(is_mqtt_conneted==false)return;
	String msg = "AT+SUBSCRIBE=" + data_id + '\n';
	uBit.serial.send(msg.c_str());
    delay(100);
}
void WJIOT::OneNET_publish(const String &data_id,const String &data_value)
{
	if(is_mqtt_conneted==false)return;
    String msg = "AT+PUBLISH=" + data_id + ',' + data_value + '\n';
	uBit.serial.send(msg.c_str());
    delay(100);
}
bool WJIOT::is_connected()
{
	return is_mqtt_conneted;
}
void WJIOT::lcd_display_number(int y, int x, int number){
    String msg = "AT+DRAW="  + String(x) + ',' + String(y+1) + ',' + String(number) + '\n';
	uBit.serial.send(msg.c_str());
    delay(100);    
}
void WJIOT::lcd_display_string(int y, int x, const String &string){
    String msg = "AT+DRAW="  + String(x) + ',' + String(y+1) + ',' + string + '\n';
	uBit.serial.send(msg.c_str());
    delay(100);    
}
void WJIOT::lcd_clear(){
    String msg = "AT+DRAW=0,1,.Clear.\n";
	uBit.serial.send(msg.c_str());
    delay(100);    
}

void mqttTick(MicroBitEvent e)
{
	int n = uBit.serial.getRxBufferSize();
	ManagedString s = uBit.serial.read(n, MicroBitSerialMode::ASYNC);
	String serial_read = s.toCharArray();
	//argumentParsing(Obloq_message_str);
	//serial_read = "";
		
    //serial_read = serial.readString()
	if (serial_read.indexOf("AT",0) != -1) {
		if (serial_read.indexOf("XMU_WIFI",0) != -1 && serial_read.indexOf("OK",0) != -1) {
			myWJIOT->is_wifi_conneted = true;
			//if (wifi_conneted) wifi_conneted()
		}
		else if (serial_read.indexOf("ONENET",0) != -1 && serial_read.indexOf("OK",0) != -1) {
			myWJIOT->is_mqtt_conneted = true;
			//if (mqtt_conneted) mqtt_conneted()
		}
		else if (serial_read.indexOf("RECEIVE",0) != -1) {
			int start_index = 11;
			//myWJIOT->receive_value = serial_read.substring(start_index, serial_read.length() - start_index);
			myWJIOT->receive_value = serial_read.substring(start_index);
			while (myWJIOT->receive_value.length() > 0) {
				String c = myWJIOT->receive_value.substring(myWJIOT->receive_value.length() - 1, myWJIOT->receive_value.length());
				if (c == "\r" || c == "\n") {
					myWJIOT->receive_value = myWJIOT->receive_value.substring(0, myWJIOT->receive_value.length() - 1);
				} else {
					break;
				}
			}
			String o;
			if (myWJIOT->mqtt_received!=NULL) myWJIOT->mqtt_received(o);
		}
	}
}