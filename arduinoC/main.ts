

enum BTN {
    //% block="A键"
    A,
    //% block="B键"
    B,
    //% block="A+B"
    AB
}

//% color="#AA278D" iconWidth=50 iconHeight=40
namespace WJ_iot {


    
	//% block="当按下 [BUTTON]" blockType="hat"
    //% BUTTON.shadow="dropdown" BUTTON.options="BTN" BUTTON.defl="BTN.A"
    export function buttonPress(parameter: any, block: any) {
        let button = parameter.BUTTON.code;
        button = replace(button);
        let name = 'button' + button + 'PressCallback';

        Generator.addEvent(name, "void", name, "", true);
        Generator.addSetup(block.id, `onEvent(ID_BUTTON_${button}, PRESS, ${name});`, false);
 
    }

    /**
     * 连接WIFI
     * @param ssid ; eg: "WIFI"
     * @param pass ; eg: "12345678"
    */
    //% block="连接WIFI 名称：[ssid] 密码：[pass]"
    //% subcategory="联网"
	
    export function WIFI_connect(parameter: any, block: any){
		let ssid=parameter.ssid.code;
		let pass=parameter.pass.code;
        Generator.addInclude('wjiot', '#include <wjiot.h>');
		Generator.addObject(`wjiot`, `WJIOT`, `wjiot;`);
		Generator.addSetup(`wjiot.begin`, `wjiot.begin();`);
		Generator.addCode(`wjiot.WIFI_connect(${ssid},${pass});`);
    }
	

    /**
     * 连接云平台
     * @param product_id ; eg: "123456"
     * @param machine_id ; eg: "123456789"
     * @param pass ; eg: "1234"
    */
    //% block="连接云平台 产品ID：[product_id] 设备ID：[machine_id] 鉴权信息：[pass]"
    //% subcategory="联网"
    export function OneNET_connect(parameter: any, block: any){
		let product_id=parameter.product_id.code;
		let machine_id=parameter.machine_id.code;
		let pass=parameter.pass.code;
        Generator.addInclude('wjiot', '#include <wjiot.h>');
		Generator.addObject(`wjiot`, `WJIOT`, `wjiot;`);
		Generator.addSetup(`wjiot.begin`, `wjiot.begin();`);
		Generator.addCode(`wjiot.OneNET_connect(${product_id},${machine_id},${pass});`);
    }
	
 
    /**
     * 向云平台发送信息
     * @param data_id ; eg: "temp"
     * @param data_value ; eg: "28.5"
    */
    //% block="向云平台发送信息 数据流名称：[data_id] 内容：[data_value]"
    //% subcategory="联网"
    export function OneNET_send(parameter: any, block: any){
        let data_id=parameter.data_id.code;
		let data_value=parameter.data_value.code;

        Generator.addInclude('wjiot', '#include <wjiot.h>');
		Generator.addObject(`wjiot`, `WJIOT`, `wjiot;`);
		Generator.addSetup(`wjiot.begin`, `wjiot.begin();`);
		Generator.addCode(`wjiot.OneNET_send(${data_id},${data_value});`);
    }   

    //% block="收到的命令" blockType="reporter"
    //% subcategory="联网"
    export function get_value(parameter: any, block: any){

        Generator.addInclude('wjiot', '#include <wjiot.h>');
		Generator.addObject(`wjiot`, `WJIOT`, `wjiot;`);
		Generator.addSetup(`wjiot.begin`, `wjiot.begin();`);
		///Generator.addCode(`wjiot.get_value()`);
		let code: string = `wjiot.get_value()`;
		Generator.addCode([code, Generator.ORDER_UNARY_POSTFIX]);
    }	
	

    /**
     * WIFI连接成功
     * @param handler WIFI connected callback
    */
    //% block="WIFI连接成功" blockType="hat"
    //% subcategory="联网"
    export function on_wifi_connected(parameter: any, block: any){
        Generator.addEvent('on_wifi_connected1', "void", 'on_wifi_connected1', "String& message", true);
        Generator.addSetup('on_wifi_connected1', `wjiot.on_wifi_connected(on_wifi_connected1);`, false);
    }


    /**
     * 云平台连接成功
     * @param handler MQTT connected callback
    */
    //% block="云平台连接成功" blockType="hat"
    //% subcategory="联网"
    export function on_mqtt_connected(parameter: any, block: any){
        Generator.addEvent('on_mqtt_connected1', "void", 'on_mqtt_connected1', "String& message", true);
        Generator.addSetup('on_mqtt_connected1', `wjiot.on_mqtt_connected(on_mqtt_connected1);`, false);
    }
    
    /**
     * On 收到云平台的命令
     * @param handler MQTT receiveed callback
    */
    //% block="当收到命令时" blockType="hat"
    //% subcategory="联网"
    export function on_mqtt_receiveed(parameter: any, block: any){
        Generator.addEvent('on_mqtt_receiveed1', "void", 'on_mqtt_receiveed1', "String& message", true);
        Generator.addSetup('on_mqtt_receiveed1', `wjiot.on_mqtt_receiveed(on_mqtt_receiveed1);`, false);
    }
    
	/**
     * 开启接收另一个设备的信息
     * @param data_id ; eg: "cmd"
    */
    //% block="开启接收另一个设备的信息 话题名称：[data_id]"
    //% subcategory="联网"
    export function OneNET_subscribe(parameter: any, block: any){
        let data_id=parameter.data_id.code;

        Generator.addInclude('wjiot', '#include <wjiot.h>');
		Generator.addObject(`wjiot`, `WJIOT`, `wjiot;`);
		Generator.addSetup(`wjiot.begin`, `wjiot.begin();`);
		Generator.addCode(`wjiot.OneNET_subscribe(${data_id});`);
    }	
	/**
     * 向另一个设备发送信息
     * @param data_id ; eg: "cmd"
     * @param data_value ; eg: "28.5"
    */
    //% block="向另一个设备发送信息 话题名称：[data_id] 内容：[data_value]"
    //% subcategory="联网"
    export function OneNET_publish(parameter: any, block: any){
		let data_id=parameter.data_id.code;
		let data_value=parameter.data_value.code;
        Generator.addInclude('wjiot', '#include <wjiot.h>');
		Generator.addObject(`wjiot`, `WJIOT`, `wjiot;`);
		Generator.addSetup(`wjiot.begin`, `wjiot.begin();`);
		Generator.addCode(`wjiot.OneNET_publish(${data_id},${data_value});`);
    }
	
	//% block="连接到云平台成功" blockType="boolean"
    //% subcategory="联网"
    export function is_connected(parameter: any, block: any){
        Generator.addInclude('wjiot', '#include <wjiot.h>');
		Generator.addObject(`wjiot`, `WJIOT`, `wjiot;`);
		Generator.addSetup(`wjiot.begin`, `wjiot.begin();`);
		///Generator.addCode(`wjiot.get_value()`);
		let code: string = `wjiot.is_connected()`;
		Generator.addCode([code, Generator.ORDER_UNARY_POSTFIX]);
    }
    /**
     * 显示数字
     * @param x ; eg: 0
     * @param y ; eg: 0
     * @param number ; eg: 666
    */
    //% block="在屏幕的位置第 [y] 行第 [x] 列上显示数字: [number]"  group="物控盒显示"
    //% subcategory="显示"
	//% x.shadow="range" x.params.min=0 x.params.max=127 x.defl=0
	//% y.shadow="range" y.params.min=0 y.params.max=127 y.defl=0
	//% number.shadow="range" number.defl=666
    export function lcd_display_number(parameter: any, block: any){
        let y=parameter.y.code;
		let x=parameter.x.code;
		let number=parameter.number.code;
        Generator.addInclude('wjiot', '#include <wjiot.h>');
		Generator.addObject(`wjiot`, `WJIOT`, `wjiot;`);
		Generator.addSetup(`wjiot.begin`, `wjiot.begin();`);
		Generator.addCode(`wjiot.lcd_display_number(${y},${x},${number});`);
    }

    /**
     * 显示文本
     * @param x ; eg: 0
     * @param y ; eg: 0
     * @param string ; eg: hello world
    */
    //% block="在屏幕的位置第 [y] 行第 [x] 列上显示文本: [string]"  group="物控盒显示"
    //% subcategory="显示"
	//% x.shadow="range" x.params.min=0 x.params.max=127 x.defl=0
	//% y.shadow="range" y.params.min=0 y.params.max=127 y.defl=0
    export function lcd_display_string(parameter: any, block: any){
        let y=parameter.y.code;
		let x=parameter.x.code;
		let string=parameter.string.code;
        Generator.addInclude('wjiot', '#include <wjiot.h>');
		Generator.addObject(`wjiot`, `WJIOT`, `wjiot;`);
		Generator.addSetup(`wjiot.begin`, `wjiot.begin();`);
		Generator.addCode(`wjiot.lcd_display_string(${y},${x},${string});`);
    }

    //% block="清除显示"  group="物控盒显示"
    //% subcategory="显示"
    export function lcd_clear(parameter: any, block: any){

        Generator.addInclude('wjiot', '#include <wjiot.h>');
		Generator.addObject(`wjiot`, `WJIOT`, `wjiot;`);
		Generator.addSetup(`wjiot.begin`, `wjiot.begin();`);
		Generator.addCode(`wjiot.lcd_clear();`);
    }

    function replace(str :string) {
        return str.replace("+", "");
    }
}


