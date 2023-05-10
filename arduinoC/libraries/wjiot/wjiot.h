#ifndef _WJIOT_H
#define _WJIOT_H

#include "Arduino.h"
#include "Stream.h"
#include<vector>
#include <iostream>

typedef void (*MsgHandleCb) (String& message);

class WJIOT
{
public:

    WJIOT();

    ~WJIOT();
	MsgHandleCb mqtt_received=NULL;
	bool is_wifi_conneted = false;
	bool is_mqtt_conneted = false;
	String receive_value;
	void serialInit(uint8_t receive, uint8_t send);
	void begin();
	void lcd_clear();
	void begin(uint8_t send, uint8_t receive);
	void WIFI_connect(const String &ssid,const String &pass);
	void OneNET_connect(const String &product_id,const String &machine_id,const String &pass);
	void OneNET_send(const String &data_id,const String &data_value);
	String get_value();
	void on_wifi_connected(const MsgHandleCb handle);
	void on_mqtt_connected(const MsgHandleCb handle);
	void on_mqtt_receiveed(const MsgHandleCb handle);
	void OneNET_subscribe(const String &data_id);
	void OneNET_publish(const String &data_id,const String &data_value);
	bool is_connected();
	void lcd_display_number(int y, int x, int number);
	void lcd_display_string(int y, int x, const String &string);
};

#endif 
