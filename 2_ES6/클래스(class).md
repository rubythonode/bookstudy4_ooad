# 클래스(class)

## 객체 지향 자바스크립트



### 객체생성

자바스크립트에서는 정적인 객체를 생성할 때는 객체 리터럴, 동적으로 객체를 생성할 때는 생성자로 객체를 생성한다.

```javascript
/* 리터럴 */
// { } 기호호로 객체를 생성한다.
var student = {
  name: "james",
  talkName() {console.log(this.name);}
}

console.log(student.name);
student.talkName();

/* 생성자 */
// 생성자 함수에 new 키워드를 붙여 호출하면 생성자로 동작하여 객체 생성, 반환
function Student(name) {
  this.name = name;
}
Student.prototype.talkName = function() {console.log(this.name);}

var s1 = new Student("Mike");
var s2 = new Student("David");
s1.talkName();
s2.talkName();
```



모든 객체는 객체 생성자를 가지는 constructor 프로퍼티를 상속한다. 객체 리터럴로 객체를 생성할 경우 constructor은 전역 Object 생성자를 가리킨다.

```javascript
console.log(student.constructor === Object);  // true
```



### 상속

자바스크립트 객체는 내부 [[prototype]] 프로퍼티로 다른 객체의 프로토타입을 참조한다. 프로토타입 객체도 자신의 프로토타입을 갖고 있고, 프로토타입이 null이 될 때 까지 체인은 이어진다. null은 프로토타입 체인의 마지막 지점에 이르러 더이상 참조할 프로토타입이 없음을 의미한다. 이 프로토타입 체인을 타고 가면서 프로퍼티를 찾는다. 자바스크립트 객체는 단 하나의 프로토타입을 가지므로 단일 상속만 지원한다. 

객체 리터럴로 객체를 생성할 때는 특수 프로퍼티 \__proto__ 를 이용하거나 `Object.setPrototypeOf()` 메소드로 객체 프로포타입 자체를 할당하지만, `Object.create()` 메소드로 주어진 프로토타입을 지닌 새 객체를 생성하는게 보통이다.

```javascript
var obj1 = {
    name: "영희",
    __proto__: {age:20}  
    
}

var obj2 = { name: "철수" }
Object.setPrototypeOf(obj2, {age: 20});

var obj3 = Object.create({age:20}, {name: {value:"지수"}});

console.log(`${obj1.name} -> ${obj1.age}`);
console.log(`${obj2.name} -> ${obj2.age}`);
console.log(`${obj3.name} -> ${obj3.age}`);
```

위의 코드에서 `{ age : 20 }` 객체는 상속받은 객체로 **기반 객체(base object), 상위 객체(super object), 부모 객체(parent object)** 라고 하며 또 다른 객체를 상속한 {name: "..."} 같은 객체를 **파생 객체(derived object), 하위 객체(sub object), 자식 객체(child object)** 라고 부른다.

객체 리터럴로 객체를 생성할 경우, 프로토타입을 할당하지 않으면 해당 객체의 프로토타입은 `Object.prototype` 프로퍼티를 가리킨다. 프로토타입 체인의 끝이라서 `Object.prototype`의 프로토타입은 null 이다.

생성자로 객체를 생성할 경우, 새 객체의 프로토타입은 생성자 함수 객체의 prototype 프로퍼티를 참조한다. 이 프로퍼티는 기본적으로 함수 자신을 가리키는 constructor 라는 프로퍼티 하나로만 구성된 객체이다. 

```javascript
function Student() { this.name="이름";}
var s3 = new Student();

console.log(s3.__proto__.constructor == Student);  // true
console.log(s3.__proto__ == Student.prototype);  // true
```



생성자 인스턴스에 새 메소드를 추가하려면 생성자의 prototype 프로퍼티에 메소드를 추가하거나 this 키워드로 추가하는 방법이 있다. 하지만 this의 경우 모든 생성자 인스턴스가 메소드 사본을 가지고 있기 때문에 메모리 측면에서 비효율적이다. 반면에 생성자 prototype 프로퍼티에 메소드를 추가하면 모든 인스턴스가 공유하는 함수 사본 하나만 생긴다.

생성자에서 상속 계층 구현은 자식 생성자가 부모 생성자를 호출하여 자신의 초기화 로직을 실행해야 하고 부모 생성자의 prototype 프로퍼티 메소드를 자식 생성자의 prototype 프로퍼티에 넣어야 자식 생성자 객체에서 끌어쓸 수 있다. 구현 방법은 정해진 것은 없지만 가장 일반적인 형태가 아래와 같다.

```javascript
// 생성자로 객체 상속 구현
function School(schoolName) {
    this.schoolName = schoolName;
}
School.prototype.printSchoolName = function() {
  console.log(this.schoolName);
}

function Student(studentName, schoolName) {
    this.studentName = studentName;
    School.call(this, schoolName);  // 부모 생성자 호출
}
Student.prototype = new School();  // 부모 생성자의 인스턴스 만들어서 할당해줌
Student.prototype.printStudentName = function() {
    console.log(this.studentName);
}

var s = new Student("지훈", "대학교");
s.printStudentName();  // 지훈
s.printSchoolName();  // 대학교
```

위와같은 방법은 부모 생성자가 단순한 프로퍼티 초기화가 아닌 DOM 조작과 같은 작업을 한다면 부모 생성자의 새 인스턴스를 자식 생성자의 prototype 프로퍼티에 할당하는 과정에서 문제가 터질 가능성 등 여러 문제가 생길수 있다.



### 원시 데이터 타입 생성자

boolean, string, number 등의 원시 데이터 타입은 각자 생성자가 있고 이들 생성자는 저마다 원시 타입을 감싸는 일을 한다. 예를 들어 String 생성자는 내부 [[PrimitiveValue]] 프로퍼티에 실제 원시값을 담은 문자열 객체를 생성한다.

런타임 시점에서 필요할 때 언제라도 원시값을 해당 타입의 생성자로 감싸고 그렇게 만들어진 객체가 실행에 걸림돌이 되지 않도록 마치 원시값처럼 취급한다. 

```javascript
var str1 = "문자열";
var str2 = new String("문자열");

console.log(`str1 : ${typeof str1} , str2 : ${typeof str2}`);
console.log(str1 === str2);
// 실제로는 str2.valueOf(); 의 값과 비교한다.

console.log(str1.length);  
// 원시타입이라 실제로는 console.log(new String(str1).length); 로 동작한다.
```

원시값을 해당 생성자로 감싸고 객체는 필요할 때 원시값으로 처리하므로 오류는 발생하지 않는다.



> ES6부터는 원시 타입에 해당 함수를 생성자로 호출하는 일이 금지된다. 즉 원시 타입을 해당 객체로써 명시적으로 감싸는 건 불가능하다. 또한 원시 타입 null, undefined는 생성자가 없다.

 (아마도 new String("str") 이런 것을 말하는듯 하다. MDN을 참고해 보면 아래와 같은 문구가 있다.)

> 기본형 변수에 대해 명시적 래퍼 객체를 만드는 것은 ECMAScript 6 부터 더 이상 지원되지 않는다. 하지만, `new Boolean`, `new String` 그리고 `new Number` 와 같이 이미 존재하고 있는 기본형 래퍼 객체는 래거시(lagacy) 요인으로 인해 아직 생성가능하다.



## 클라스 다루기

javascript class는 ES6를 통해 소개되었으며 생성자 및 상속을 보다 명료하게 사용할 수 있다.  Class 문법은 새로운 객체지향 상속 모델을 제공하는 것은 아니며 객체를 생성하고 상속을 다루는데 있어 더 단순하고 명확한 문법을 제공한다.



### Class 정의

Class는 사실 function 이다. class 문법도 function과 유사하게 class 표현식과 class 선언 두가지 방법을 제공한다.

**Class 선언**

class 선언은 class 키워드와 클래스 이름을 함께 사용해서 만든다.  클래스 내 메소드는 function 키워드 없이 정의되며 메소드 사이에는 콤마를 찍지 않는다. 

클래스는 함수로, 클래스명은 함수명으로, constructor 메소드 바디는 함수 바디로 간주된다. 클래스 바디 안의 모든 코드는 기본적으로 strict 모드로 실행된다.

```javascript
class Car {
    constructor(wheels, doors) {
        this.wheels = wheels;
        this.doors = doors;
    }
}

console.log(typeof Car);  // function (클래스는 함수이다.)
const c = new Car(4,4);
```

```javascript
// ES5 버전
function Car(wheels, doors) {
	this.wheels = wheels;
    this.doors = doors;
}
```



**호이스팅**

함수 선언과 클래스 선언의 중요한 차이점은 클래스 선언은 호이스팅이 일어나지 않는다는 것이다. 따라서 클래스를 사용하기 위해서는 클래스를 먼저 선언해야 하며 그렇지 않으면 ReferenceError가 발생할 것이다.



**Class 표현식**

class 표현식은 class를 정의하는 또 하나의 방법으로, 이름을 가질 수도, 가지지 않을 수도 있다. 기명 class 표현식에 주어진 이름은 클래스의 body에 대해 local scope에 한해 유효하다.

```javascript
const Car = class {
    constructor(wheels, doors) {
        this.wheels = wheels;
        this.doors = doors;
    }
}

const Car = class Car { 
    // 내용 위와 동일
}
```

```javascript
// ES5 버전
var Car = function (wheels, doors) {
	this.wheels = wheels;
    this.doors = doors;
}

var Car = function Car(wheels, doors) {
	// 내용 위와 동일
}
```



**Constructor (생성자)**

constructor 메소드는 class로 생성된 객체를 생성하고 초기화하기 위한 특수한 메소드이다. 이 메소드는 클래스 안에 한개만 존재할수 있으며 2개 이상있을 경우 SyntaxError가 발생한다. 

부모 클래스의 constructor를 호출하기 위해서는 super 키워드를 사용하면 된다.



### 프로토타입 메소드

클래스 바디 안에 있는 메소드는 모두 클랫의 prototype 프로퍼티에 추가된다. 이 프로퍼티는 클래스로부터 생성한 객체들의 프로퍼티이다.

```javascript
class Car {
    constructor(wheels, doors) {
        this.wheels = wheels;
        this.doors = doors;
    }
    showCar() {
        console.log(`wheels:${this.wheels} || doors:${this.doors}`);
    }
}

const c = new Car(4,4);
c.showCar();  // wheels:4 || doors:4
console.log("showCar" in c.__proto__);  // true
console.log("showCar" in Car.prototype);  // true
```



**get/set 메소드**

ES6부터 메소드 앞에 get, set을 붙일수 있으며, class나 객체리터럴에 추가하여 접근자 프로퍼티의  get / set 속성을 줄 수 있다. 클래스 바디에 get, set을 추가하면 클래스의 prototype 프로퍼티에 추가된다.

```javascript
class Car {
    constructor(wheels, doors) {
        this._wheels = wheels;
        this.doors = doors;
    }
    get wheels() { return this._wheels }
    set wheels(n) { this._wheels = n;}
}

const log = console.log;

const c = new Car(4,4);
log("wheels" in c.__proto__);  // true
log("wheels" in Car.prototype);  // true

log(Object.getOwnPropertyDescriptor(c.__proto__, "wheels").get);  
// ƒ get wheels() { return this._wheels }
log(Object.getOwnPropertyDescriptor(c.__proto__, "wheels").set);  
// ƒ set wheels(n) { this._wheels = n;}
log(Object.getOwnPropertyDescriptor(c, "_wheels").value);  // 4
```

접근자 프로퍼티를 생성하여 \_wheels 프로퍼티를 캡슐화했으며 콘솔 로그를 통해 wheels가 클래스의 prototype 프로퍼티에 추가된 접근자 프로퍼티임을 확인했다.



**제네레이터 메소드**

객체 리터럴의 단축 메소드 또는 클래스의 메소드를 제네레이터 메소드로 취급하려면 앞에 `*` 기호를 달아주면 된다. 클래스에 선엉ㄴ한 제네레이터 메소드는 클래스 prototype 프로퍼티에 추가된다.

```javascript
class myClass {
    * generator_func() {
        yield 1;
        yield 2;
      	yield 3;
      	yield 4;
      	yield 5;
    }
}

const log = console.log;

const obj = new myClass();
const generator = obj.generator_func();

log(generator.next().value);  // 1
log(generator.next().value);  // 2
log(generator.next().value);  // 3
log(generator.next().value);  // 4
log(generator.next().value);  // 5
log(generator.next().done);  // true
log("generator_func" in myClass.prototype);  // true
```



### 정적 메소드

클래스 바디에서 메소드명 앞에 static을 붙인 메소드를 정적 메소드(static method) 라고 한다. 클래스 prototype 프로퍼티가 아닌, 클래스의 자체 메소드이다. 예를 들어, Sring.fromCharCode() 메소드는 String 생성자의 정적 메소드, 즉 String 함수 자신의 고유 프로퍼티다.

정적 메소드는 주로 애플리케이션의 유틸리티 함수 작성에 쓰인다.

```javascript
class Student {
    constructor(name) {
        this.name = name;
    }
    static showName(student) {
        console.log(student.name)
    }
}

const s1 = new Student("경희");
Student.showName(s1);  // 경희
```

```javascript
// ES5
function Student(name) {
    this.name = name;
}
Student.showName = function(student) {
    console.log(student.name);
}
```



### 클래스의 상속 구현

ES6부터는 클래스에 extends 절 및 super 키워드를 도입하여 복잡한 함수의 상속 계층 구현을 쉽게 풀어나가고자 했다. extends 절을 이용해서 클래스가 다른 생성자의 정적/비정적 프로퍼티를 상속할 수 있게 한 것이다.

`super` 키워드는 1 . 클래스 constructor 메소드에서 부모 생성자를 호출하며,  2 . 클래스 메소드 내부에서 부모 생성자의 정적/비정적 메소드를 참조한다.

```javascript
function A(a) {
    this.a = a;
}
A.prototype.printA = function() {console.log(this.a);}

class B extends A {
    constructor(a, b) {
        super(a);
        this.b = b;
    }
    printB() {
      console.log(this.b);
    }
    static sayHello() {
        console.log("안녕하세요~!");
    }
}

class C extends B {
    constructor(a, b, c) {
        super(a, b);
        this.c = c;
    }
    printC() {
        console.log(this.c);
    }
    printAll() {
        this.printC();
        super.printB();
        super.printA();
    }
}

var obj = new C(11, 22, 33); // 33  // 22  // 11
obj.printAll();  // 안녕하세요~!
C.sayHello();

```



A는 함수 생성자, B는 A를 상속한 클래스, C는 B를 상속한 클래스다. B가 A를 상속하므로 C도 A를 상속한다. 클래스도 함수 생성자를 상속할 수 있으며, String, Array 같은 기존 함수들의 생성자를 비롯하여 임의의 함수 생성자도 상속 가능하다.

`super` 키워드의 경우 constructor 메소드 안에서는 this 보다 먼저 사용되지 않으면 예외가 발생한다. 만약 자식 클래스에 constructor 메소드가 없으면 부모 클래스의 constructor 메소드가 자동으로 호출된다.



### 조합 메소드 명

클래스의 메소드명, 객체 리터럴의 메소드명은 런타임 시점에 표현식으로 조합할 수 있다.

```javascript
class myClass {
    static ["my" + "Method"] () {
        console.log("헬로우~!");
    }
}
myClass.myMethod();  // 헬로우~!
```



심볼을 메소드 키로 하여 조합하는 방법도 있다.

```javascript
var s = Symbol("Sample");
class myClass {
    static [s] () {
        console.log("심볼이 키입니다.");
    }
}
myClass[s]();  // 심볼이 키입니다.
```



### 프로퍼티 속성

클래스를 이용한 생성자의 정적/비정적 프로퍼티 속성은, 함수를 사용할 때와 몇가지 차이점이 있다.

| 속성              | writable | configurable | enumerable |
| --------------- | :------: | :----------: | :--------: |
| 정적 메소드          |    O     |      O       |     X      |
| 클래스 prototype   |    X     |      X       |     X      |
| 클래스 constructor |    X     |      X       |     X      |
| prototype 프로퍼티  |    O     |      O       |     X      |



### 생성자 메소드 결과를 오버라이딩

constructor 메소드는 내부에 return 문이 없을 경우 새 인스턴스를 반환한다. return 문이 있으면 해당 값을 반환한다.  constructor 메소드의 return 은 object와 undefined만 가능하다. 그렇지 않을 경우 `Uncaught TypeError: Class constructors may only return object or undefined` 라고 에러가 발생한다.

```javascript
class MyClass {
    constructor() {
        return Object.create(null);
    }
}

console.log(new MyClass() instanceof MyClass);
```



### 정적 접근자 프로퍼티, Symbol.species

정적 접근자 프로퍼티, @@species는 부모 생성자 메소드가 새 인스턴스를 반환하면 어떤 생성자를 써야 할 지 알려줘야 할 때 자식 생성자에 선택적으로 추가한다. 자식 생성자에 @@species가 따로 없으면 부모 생성자 메소드는 기본 생성자를 이용한다.

배열 객체의 map() 메소드가 새 Array 인스턴스를 반환하는 것이 좋은 사례다. 배열 객체를 상속한 객체의 map 메소드를 호출하면 Array 생성자가 아닌, 자식 생성자의 새 인스턴스가 반환된다. 그래서 ES6에 @@species 프로퍼티가 도입되어 기본 생성자 대신 다른 생성자를 사용하라는 신호를 보낼수 있게 되었다.

```javascript
class MyArr1 extends Array {
    static get [Symbol.species] () {
        return Array;
    }
}
class MyArr2 extends Array {}

var arr1 = new MyArr1(0, 1, 2, 3, 4);
var arr2 = new MyArr2(0, 1, 2, 3, 4);

console.log(arr1 instanceof MyArr1);  // true
console.log(arr2 instanceof MyArr2);  // true

arr1 = arr1.map(v => v+1);
arr2 = arr2.map(v => v+1);

console.log(arr1 instanceof MyArr1);  // false
console.log(arr2 instanceof MyArr2);  // true

console.log(arr1 instanceof Array);  // true
console.log(arr2 instanceof Array);  // true

// 책에선 마지막 것이 false라고 하는데 실제로는 true 이다.

```



자바스크립트 라이브러리를 제작하는 개발자라면 새 인스턴스를 반환할 때 생성자 메소드가 항상 @@species 프로퍼티를 참조하도록 작성하는게 좋다.

```javascript
// myArray1가 라이브러리 일부라고 가정한다.
class myArray1 {
    // 기본 @@species. 자식 클래스는 이 프로퍼티를 상속한다.
    static get [Symbol.species] () {
        // 기본 생성자
        return this;
    }
    mapping() {
        return new this.constructor[Symbol.species] ();
    }
}

class myArray2 extends myArray1 {
    static get [Symbol.species] () {
        return myArray1;
    }
}

var arr = new myArray2();
console.log(arr instanceof myArray2);  // true
arr = arr.mapping();
console.log(arr instanceof myArray1);  // true
```



부모 생성자에 기본 @@species 프로퍼티를 정의하고싶지 않을 경우 if..else 조건문으로 @@species 프로퍼티의 정의 여부를 확인할 수도 있지만 이 책에서 설명한 패턴이 더 좋다. 내장 메소드 map() 또한 그렇게 작성되어 있다.

ES6부터 자바스크립트 생성자의 모든 내장 메소드는 새 인스턴스 반환시 @@species 프로퍼티를 조사한다. 예를 들어 배열, 맵, 뱅려 버퍼, 프라미스등의 생성자는 인스턴스를 생성하여 반환할 때 @@species를 찾아본다.



### 암시적 파라미터, new.target

ES6는 함수에 전부 new.target 파라미터를 추가했다. 중간의 점도 파라미터명의 일부다. 이 파라미터의 기본 값은 undefined지만, 생성자로 함수 호출시에 다음 조건일때 값이 달라진다.

- 생성자를 new 키워드로 호춣하면 new.target은 생성자를 가리킨다.
- 생성자를 super 키워드로 호출하면 new.target값은 super에 해당하는생성자의 new .target 값이다.

화살표 함수에서는 자신을 둘러싸고 있는 화살표 아닌 함수의 new.target 값을 가리킨다.

```javascript
function myConstructor() {
    console.log(new.target.name);
}

class myClass extends myConstructor {
    constructor() {
        super();
    }
}

const obj1 = new myClass();  // myClass
const obj2 = new myConstructor();  // myConstructor
```



## 객체 리터럴에 super 사용

super 키워드는 객체 리터럴의 단축 메소드에서도 사용할 수 있다. 객체 리터럴로 정의한 객체의 [[prototype]] 프로퍼티와 같은 값이다. 객체 리터럴의 super는 자식 객체가 오버라이드한 프로퍼티를 접근하는 용도로 쓴다.

```javascript
const obj1 = {
    print() {
      console.log("안녕하세요");
    }
}

const obj2 = {
    print() {
        super.print();
    }
}

Object.setPrototypeOf(obj2, obj1);
obj2.print();  // 안녕하세요
```

