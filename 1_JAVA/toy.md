# 작은 프로젝트

전문을 생성하고 파싱하는 프로그램을 만들어본다. 파싱 (Parsing) 은 업계에서 흔히 사용하는 용어로 "전문을 길이대로 자른다" 는 의미이다.



**파싱규칙**

- 요청전문으로 "이름", "전화번호" 를 보내면 응답전문으로 "생일", "주소"를 반환
- "이름"은 10자리, "전화번호"는 11자리, "생일"은 8자리, "주소"는 30자리이다.

| 구분   | 항목(길이)            |
| ---- | ----------------- |
| 요청   | 이름(10) + 전화번호(11) |
| 응답   | 생일(8) + 주소(30)    |



요청 전문 예시

```
// 이름 + 공백2개 (6+4byte) + 전화번호(11byte) 
홍길동 01012345678 
```



응답전문의 예

```
// 생일(8byte) + 주소(30byte)
19801215서울시 송파구 장실동 123-4
```



## 전문 생성

보통 데이터 성격의 클래스를 만들 때에는 필요한 속성을 private으로 선언한 후에 Getter, Setter를 만들어 사용한다. 

```java
public class Item {
  // 필요한 속성 : 이름, 길이, 값
  // 직접 접근할 필요 없으니 private 로 변환
  private String name;
  private int length;
  private String value;
  
  // 접근할 getter, setter를 설정한다.
  public String getName() { return name; }
  public void setName(String name) { this.name = name; }
  
  public int getLength() { return length; }
  public void setLength(int length) { this.length = length; }
  
  public String getValue() { return value; }
  public void setValue(String value) { this.value = value; }
  
}
```

  

raw 메소드는 바이트 체크후에 남는 바이트 수 만큼 여백을 추가하는 메소드이다.

```java
// item에 붙인다.
public String raw() {
  StringBuffer padded = new StringBuffer(this.value);
  // 한글이라서 바이트 변환후에length를 체크해야 한다.
  // 안 그러면 하나의 글자당 길이를 1로 계산하기 때문이다. 한글은 한글자당 2바이트
  // 하지만 EUC-kr에서만 2바이트이며 UTF-8에서는 3바이트이다. (주의)
  // 전문 송수신 시 길이체크는 항상 바이트 단위로 변환후 체크하는게 안전하다.	
  while(padded.toString().getBytes().length < this.length) {
    padded.append(' ');
  }
  return padded.toString();
}

public static void main(String args[]) {
  Item item = new Item();
  item.setName("name");
  item.setLength(10);
  item.setValue("홍길동");
  System.out.println("["+item.raw()+"]")
}
```

  

여러개의 아이템을 포함하는 Packet 클래스를 만든다.

```java
import java.util.ArrayList;

public class Packet {
  // Item 갯수가 가변이라 ArrayList를 이용
  private ArrayList<Item> items = new ArrayList<Item>();
  
  // item을 넣고 뺀다.
  public void addItem(Item item) {
    this.items.add(item);
  }
  public Item getItem(int index) {
    return this.items.get(index);
  }
  
  // item 값들을 모두 더해서 반환한다.
  public String raw() {
    StringBuffer result = new StringBuffer();
    for(Item item: items) {
      result.append(item.raw());
    }
    return result.toString();
  }
}
```

중간 테스트

```java
public static void main(String[] args) {
    Packet packet = new Packet();
  
    // 일반적인 사용
    Item item1 = new Item();
    item1.setName("name");
    item1.setLength(10);
    item1.setValue("hongil");

    Item item2 = new Item();
    item2.setName("phone");
    item2.setLength(11);
    item2.setValue("01012341234");
  
    // 팩토리 메소드를 이용한 사용
    Item item1 = Item.create("name", 10, "hongil");
    Item item2 = Item.create("phone", 11, "01012341234");
    //////////////////////////////////////////////////////
  
    packet.addItem(item1);
    packet.addItem(item2);

    System.out.println("["+packet.raw()+"]");
}
```



위처럼 Item.set .... 이런식으로 Item 객체 생성과정이 장환하니 좀더 간략하게 만들어줄 create라는 istatic 메소드를 추가한다.  create static 메소드는 name, length, value 입력을 받아 Item 객체를 생성 및 반환한다. 이러한 메소드를 **팩토리 메소드**라고 한다.

```java
  // Item class 에 추가한다.
  public static Item create(String name, int length, String value) {
    Item item = new Item();
    item.setName(name);
    item.setLength(length);
    item.setValue(value);
    return item;
  }
```



**자바스크립트 버전**

```javascript

function Item () {
  var _name, _length, _value;
  this.getName = function(){return _name;}
  this.setName = function(n){_name = n;}

  this.getLength = function(){return _length;}
  this.setLength = function(l){_length = l}

  this.getValue = function(){return _value;}
  this.setValue = function(v){_value = v;}
}

Item.prototype.raw = function() {
  var len = this.getLength();
  var value = this.getValue();
  
  for(var one,total = i = 0; one = value.charCodeAt(i); i++) {
    total += one >> 11 ? 3 : one >> 7 ? 2 : 1;
  }

  for(var i = len - total; i > 0; i--) {
    value += " ";
  }  
  
  return value;
}

Item.create = function(name, length, value) {
  if( typeof name !== 'string' || isNaN(length) || typeof value !== 'string' ) 
    throw "인자 입력을 다시 해주시기 바랍니다.";
  
  var temp = new Item();
  temp.setName(name);
  temp.setLength(length);
  temp.setValue(value);
  return temp;
}



function Packet() {
  var items = [];

  this.addItem = function(item) {
    if(!(item instanceof Item)) throw "Item 클래스만 가능합니다.";
    items.push(item);
  }
  this.getItem = function(index) {
    if(isNaN(index)) throw "숫자만 가능합니다." ;
    return items[index];
  }
  this.raw = function() {
    var result = [];
    items.forEach( function(one){result.push(one.raw());});
    return result.join("");
  }
}

// 실행

var pkt = new Packet();
var iteml = Item.create("name", 10, "홍길동");
var item2 = Item.create("phone", 11, "01012341234");
pkt.addItem(item1);
pkt.addItem(item2);
```





## 전문 파싱

다음과 같이 전문을 받는다고 해본다. 생일(8) + 주소(30) 의 형태이다.

```
19820303서울시 송파구 잠실동 123-4
```



파싱을 위한 항목과 길이를 알고 있으므로 Packet을 만들고 값은 null로 세팅한다.

```java
Packet recvPkt = new Packet();
recvPkt.addItem(Item.create("birth", 8, null));
recvPkt.addItem(Item.create("address", 30, null));

// 이런식으로 파싱할 것이다.
recvPacket.parse("19801215서울시 송파구 잠실동 123-3    ");
```



Packet 클래스에 parse메소드를 추가한다.

parse 메소드는 먼저 전문을 바이트 배열로 바꾸고 item들을 순차적으로 돌면서 아이템의 길이만큼 temp 라는 바이트 배열을 만든후에 arraycopy를 이용하여 값을 복사한다.

```java
public void parse(String data) {
  byte[] bdata = data.getBytes();
  int pos = 0;
  for(Item item : items) {
    byte[] temp = new byte[item.getLength()];
    // arraycopy(소스, 소스시작위치, 대상, 대상시작위치, 복사할 길이)
    System.arraycopy(bdata, pos, temp, 0, item.getLength());
    pos += item.getLength();
    item.setValue(new String(temp));
  }
}
```

```java
public static void main(String[] args) {
  // 실행 코드
  Packet recvPacket = new Packet();
  recvPacket.addItem(Item.create("birth", 8, null));
  recvPacket.addItem(Item.create("address", 30, null));
  recvPacket.parse("19801215seoul songpagu 123-3    ");
  System.out.println(recvPacket.getItem(1).raw());
}
```



하지만 `getItem(1)` 이렇게 사용할 경우 몇번째 항목이 무엇인지를 다 알고 있어야 한다. 그 항목이 여러개가 되면 모든 항목들의 위치를 알아야 하므로 불편하다. 따라서 Packet 클래스에서 한개의 item에 접근하는 방법은 그 item의 이름으로 접근하는것이 좋다.

```java
// packet.java

// key는 아이템의 이름, value는 Item이다.
private HashMap<String, Item> nameAccess = new HashMap<String, Item>();

public void addItem(Item item) {
  // 각각의 item이 동일한 이름으로 사용할수 있다. 이렇게 nameAccess 키가 중복되면
  // 문제가 생길수 있으니 전문 생성시 동일한 이름으로 설정할 수 없다는 규칙이 있어야 한다.
  if(nameAccess.containKey(item.getName())) 
    throw new RuntimeException( "Duplicated item name:["+item.getName()+"]");
  
  this.items.add(item);
  // 아이템 추가시 nameAccess 에도 동일하게 아이템이 추가되게 하기 위함
  nameAccess.put(item.getName(), item);
}

// 이제 이름으로 가져올 수 있다.
public Item getItem(String name) {
  return nameAccess.get(name);
}
```



실행시에는 다음과 같이 가능하다.

```java
System.out.println(recvPacket.getItem("주소").raw());
```



**자바스크립트 버전**

```javascript

function Item () {
  var _name, _length, _value;
  this.getName = function(){return _name;}
  this.setName = function(n){_name = n;}

  this.getLength = function(){return _length;}
  this.setLength = function(l){_length = l}

  this.getValue = function(){return _value;}
  this.setValue = function(v){_value = v;}
}

Item.prototype.raw = function() {
  var len = this.getLength();
  var value = this.getValue();
  
  for(var one,total = i = 0; one = value.charCodeAt(i); i++) {
    total += one >> 11 ? 3 : one >> 7 ? 2 : 1;
  }

  for(var i = len - total; i > 0; i--) {
    value += " ";
  }  
  
  return value;
}

Item.create = function(name, length, value) {
  if( typeof name !== 'string' || isNaN(length) || typeof value !== 'string' ) 
    throw "인자 입력을 다시 해주시기 바랍니다.";
  
  var temp = new Item();
  temp.setName(name);
  temp.setLength(length);
  temp.setValue(value);
  return temp;
}



function Packet() {
  var items = [];
  var nameAccess = Object.create(null); // <- 추가

  this.addItem = function(item) {
    if(!(item instanceof Item)) throw "Item 클래스만 가능합니다.";
    if(nameAccess[item.getName()]) 
      throw item.getName()+"은 이미 동일한 이름이 존재합니다.";
    
    nameAccess[item.getName()] = item;
    items.push(item);
  }
  
  this.getItem = function(name) {
    //if(isNaN(index)) throw "숫자만 가능합니다." ;
    if(typeof name !== 'string') throw "name은 문자만 가능합니다." ;
    
    //return items[index];
    return nameAccess[name];
  }
  
  this.raw = function() {
    var result = [];
    items.forEach( function(one){result.push(one.raw());});
    return result.join("");
  }
  
  this.parse = function(data) {
    var dataArr = data.split("");
    var temp, pos = 0;
    items.forEach(function(one) {
      var len = one.getLength();
      var i = 0, charCode = 0;
      
      // while문으로 순환해야 한다.
      while(true) {
        charCode = dataArr[i].charCodeAt();
        len = len - (charCode >> 11 ? 3 : one >> 7 ? 2 : 1);    
        if(len < 1) break;
        --i;
      }
      
      //i-1 까지의 값까지 배열을 복사한다.
    });
  }
}

// 실행

var pkt = new Packet();
var iteml = Item.create("name", 10, "홍길동");
var item2 = Item.create("phone", 11, "01012341234");
pkt.addItem(item1);
pkt.addItem(item2);
```

