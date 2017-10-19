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
console.log(arr2 instanceof Array);  // true <= 이부분

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



## 참고

### Object.setPrototypeOf()

이 메서드는 null 또는 또다른 객체에 특정한 객체 프로토타입을 설정할 수 있다.

```javascript
Object.setPrototypeOf(obj, prototype);
// obj : 프로포타입을 설정할 객체
// prototype : 객체의 새로운 프로토타입 (객체 or null)
// return : 생성된 특정 객체
```



> **주의!**
>
> 최신브라우저에서 객체의 `[[Prototype]]` 을  변경하는 것은 매우 느릴수 있다. 왜냐하면 최신브라우저에서 쓰이는 현대 자바스크립트 엔진에서 프로퍼티 액세스를 최적화하는 방식의 특성 때문이다.
>
> 상속 변경이 성능에 미치는 영향은 미묘하고도 광범위 하며, 단순히 `obj.__proto__ = ...` 에 접근하는데 소비되는 시간적인 제약 뿐만 아니라 변경된 `[[Prototype]]`에 접근하는 모든 코드들에까지 확장될 수 있다.
>
> 만약 성능에 관심이 있다면 반드시 객체의  `[[Proto]]` 에 설정하는 것을 피해야 한다. 대신 원하는 `[[Prototype]]` 를 `Object.create()` 를 이용해서 새로운 객체를 만들어라.



**설명**

만일 프로토타입이 변결될 객제가 [`Object.isExtensible()`](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Object/isExtensible) 에 의해서 non-extensible 하다면,  [`TypeError`](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/TypeError) 예외처리를 해라. 만일 프로토타입 파라미터가 객체가 아니거나 [`null`](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/null) (i.e., number, string, boolean,  [`undefined`](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/undefined)) 인 경우가 아니라면 어떠한 작업도 하지마라. 이 방법을 통해서 객제의 프로토타입이 새로운 값으로 변경 될것이다.

Object.setPrototypeOf는 ECMAScript 2015 스펙으로 규정되어 있다. 해당 메소드는 일반적으로 객체의 프로토 타입과 논쟁이 되는 [`Object.prototype.__proto__`](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Object/__proto__) 프로퍼티를 설정하는 적절한 방법으로 고려된다. 

```
var dict = Object.setPrototypeOf({}, null);
```





### [Object.getOwnPropertyDescriptor()](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertyDescriptor)

이 메서드는 주어진 객체 자신의 속성에 대한 속성 설명자를 반환한다. 

```javascript
Object.getOwnPropertyDescriptor(obj, prop);
// obj : 속성을 찾을 대상 객체, prop : 설명이 검색될 속성 이름
// 반환값 : 객체에 존재하는 경우 주어진 속성의 속성 설명자, 없으면 undefined
```



**설명**

이 메서드는 정확한 속성 설명의 검사를 허용한다. JS에서 속성은 문자열 값인 이름과 property descriptor로 구성된다. property descriptor 유형과  속성에 관한 자세한 정보는 [`Object.defineProperty()`](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty)에서 찾을 수 있다. 

A property descriptor is a record with some of the following attributes:

`value` : 프로퍼티와 관련된 값 (데이터 설명자에만).

`get` : 프로퍼티에 대해 getter로 제공하는 함수이며 없을 경우 undefined

`set` : 프로퍼티에 대해 setter로 제공하는 함수이며 없을 경우 undefined

`writable` : 프로퍼티와 관련된 값이 변경될 수 있는 경우에만 true

`configurable` :  이 프로퍼티 descriptor 의 유형이 바뀔 수 있고 프로퍼티가 해당 객체에서 삭제될 수 있는 경우에 true. ( configurable이 false일 경우 writable, enumerable, get, set을 재정의 할수가 없다.  `Cannot redefine property` 이런식으로 에러메세지가 발생한다. ) 

`enumerable` : 이 프로퍼티가 해당 객체의 프로퍼티들을 열거할 때 나타나는 경우에만 true

```javascript
var o, d;

o = { get foo() { return 17; } };
d = Object.getOwnPropertyDescriptor(o, 'foo');
console.log(d);
// d는 { configurable: true, enumerable: true, get: f, set: undefined }

o = { bar: 42 };
d = Object.getOwnPropertyDescriptor(o, 'bar');
console.log(d);
// d는 { configurable: true, enumerable: true, value: 42, writable: true }

o = {};
Object.defineProperty(o, 'baz', { 
  value: 8675309, writable: false, enumerable: false 
});
d = Object.getOwnPropertyDescriptor(o, 'baz');
console.log(d);
// d는 { value: 8675309, writable: false, enumerable: false, configurable: false }
```



**주의**

ES5에서는 이 메서드의 첫번째 인수가 객체가 아닐 경우 TypeError가 발생하지만 ES6에서는 객체로 강제 변환되어 처리된다.

```javascript
Object.getOwnPropertyDescriptor("foo", 0);
// TypeError: "foo"는 객체가 아닙니다  // ES5 코드

Object.getOwnPropertyDescriptor("foo", 0);
// {configurable:false, enumerable:true, value:"f", writable:false}  // ES6 코드
```



### [Object.getOwnPropertyDescriptors()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertyDescriptors)

이 메서드는 주어진 객체의 모든 프로퍼티 descriptor를 반환한다.

```javascript
Object.getOwnPropertyDescriptors(obj);
// obj : 해당 객체가 가지고 있는 모든 property descriptors를 얻어올 대상 객체
```

```javascript
var o;

o = { get foo() { return 17; } };
o.bar = 42;
Object.defineProperty(o, 'baz', { 
  value: 8675309, writable: false, enumerable: false 
});

console.log(Object.getOwnPropertyDescriptors(o));
/* {foo: {…}, bar: {…}, baz: {…}}
bar:{value: 42, writable: true, enumerable: true, configurable: true}
baz:{value: 8675309, writable: false, enumerable: false, configurable: false}
foo:{set: undefined, enumerable: true, configurable: true, get: ƒ}
*/
```





### 제네레이터

제네레이터는 하나의 값만 반환하는게 아니라 한버에 하나씩 여러값을 반환하는 함수이다. 이 함수를 호출하면 바로 실행하지 않고 제네레이터 객체(이터러블 + 이터레이터 프로토콜을 모두 구현한 객체) 인스턴스를 반환한다.

제네레이터 객체는 제네레이터 함수의 새로운 실행 콘텍스트를 갖고, nest() 메소드를 실행하면 제네레이터 함수 바디를 죽 실행하다가 yield 키워드를 만나면 바로 중지하고 yield 된 값을 반환한다. 그리고 다시 next() 메소드를 부르면 멈춘 지점부터 실행이 재개되고 그 다음 yield된 값을 낸다. 제네레이터 함수에 더이상 yield 할 값이 남아있지 않을 때 done 프로퍼티는 true가 된다.



**문법**

제네레이터 함수는 `function*` 으로 표기한다.

```javascript
function* generator_func() {
    yield 1; yield 2; yield 3; yield 4;
}

const gf = generator_func();
console.log(gf.next());  // {value: 1, done: false}
console.log(gf.next());  // {value: 2, done: false}
console.log(gf.next());  // {value: 3, done: false}
console.log(gf.next());  // {value: 4, done: false}
console.log(gf.next().done);  // true
```



**메서드**

`Generator.prototype.next()` : yield 표현을 통해 yield된 값을 반환한다.

`Generator.prototype.return(value)`

제네레이터 함수는 모든 값을 반환하기 전, 제네레이터 객체의 return() 메소드에 마지막 반환값을 선택 인자로 넘겨 언제라도 도중에 종료할 수 있다.

```javascript
function* generator_func() {
    yield 1; yield 2; yield 3; yield 4;
}

const gf = generator_func();
console.log(gf.next());  // {value: 1, done: false}
console.log(gf.return("끝"));  // {value: "끝", done: true}
console.log(gf.next());  // {value: undefined, done: true}
```



`Generator.prototype.throw(exception)`

제네레이터 함수 내에서 임의로 예외를 발생시키려면 제네레이터 객체의 throw() 메소드에 예외 객체를 지정한다. 즉 생성기로 에러를 throw 한다.

```javascript
function* generator_func() {
    try{yield 1;}
    catch(e){console.log('1번째 예외')}
  
    try{yield 2;}
    catch(e){console.log('2번째 예외')}
  
    try{yield 3;}
    catch(e){console.log('3번째 예외')}
  
    try{yield 4;}
    catch(e){console.log('4번째 예외')}
}

const gf = generator_func();
console.log('next => ',gf.next());
console.log('throw => ',gf.throw("예외 문자열1"));
console.log('throw => ',gf.throw("예외 문자열2"));
```

실행결과

```
next =>  {value: 1, done: false}
1번째 예외
throw =>  {value: 2, done: false}
2번째 예외
throw =>  {value: 3, done: false}
```

마지막에 제네레이터 함수가 멈춘 지점에서  예외가 발생했다. 예외처리가 끝난 후  throw()는 계속 실행되어서 그 다음 yield된 값을 반환한다.



**yield* 키워드**

제네레이터 함수 안에서 다른 이터러블 객체를 순회한 이후 그 값을 yield 하려면 yield* 키워드에 해당 표현식을 지정한다.

```javascript
function* generator_func_1() {
    yield 2;
    yield 3;
}

function* generator_func_2() {
    yield 1;
    yield* generator_func_1();
    yield* [4, 5];
}


var gf = generator_func_2();
console.log(gf.next());  // {value: 1, done: false}
console.log(gf.next());  // {value: 2, done: false}
console.log(gf.next());  // {value: 3, done: false}
console.log(gf.next());  // {value: 4, done: false}
console.log(gf.next());  // {value: 5, done: false}
console.log(gf.next().done);  // true
```



**for .. of 루프**

이터러블 객체를 next()로 순회하는 것은 불편할 수 있기 때문에 더 간편한 for ... of 루프문을 ES6에서 제공한다. for ... of 루프는 이터러블 객체 값을 순회하는 구문이다.

```javascript
function* generator_func() {
    yield 1; yield 2; yield 3; yield 4;
}

const gf = generator_func();
for(let v of gf) {
    console.log(v);
}

// 1
// 2
// 3
// 4
// undefined
```



### 꼬리 호출 최적화 (tail call optimization, TCO)

어떤 함수를 호출하면 메모리에 실행 스택을 형성해서 함수의 함수의 변수를 저장한다.

함수 안에서 다른 함수를 호출해도 실행 스택이 새로 생성되는데, 중첨된 내부 함수가 실행을 끝내고 자신을 호출한 함수를 재개하려면 그 주소를 어딘가 보관해야 한다. 따라서 내부 함수의 실행 스택만큼 메모리를 더 점유하게 된다.  그런다고 실행 스택을 교환(switch)하여 생성하면 CPU시간이 소비된다.

중첩 수준이 수백 단계에 이르게 되면 자바스크립트 엔진이 `RangeError: Maximum call stack size exceeded` 예외를 던지면서 심각한 문제가 생긴다.

꼬리 호출(tail call) 은 무조건 함수 끝(꼬리)에서 return 문을 실행하도록 함수를 호출하는 기법이다. 똑같은 함수 호출이 꼬리에 꼬리를 물고 이어지는, 꼬리 재귀(tail recursion)라는 재귀의 특수한 형태이다. 꼬리 호출을 하면 실행 스택을 새로 만들지 ㅇ낳고 기존 스택을 재사용할 수 있기 때문에 부가적인 CPU 연산과 메모리 점유가 실제로 발생하지 않는다. 꼬리 호출 최적화(tail call optimization)는 꼬리 호출로 실행 스택을 재활용하는 것이다.

ES6 부터는 "use strict" 모드가 실행하면 꼬리 호출 최적화를 자동으로 수행한다고 되어 있지만, 실제로 2017년 10월 20일 기준으로는 사파리 최신 브라우저, 최신 웹킷을 제외한 대부분의 자바스크립트 엔진, 브라우저에서 지원되지 않고 있다. [[참고]](https://kangax.github.io/compat-table/es6/)

```javascript
"use strict";

const _add = (x, y) => x + y;
const add1 = (x, y) => {
    x = parseInt(x);
    y = parseInt(y);
  
    // 꼬리 호출
    return _add(x, y);
}

const add2 = (x, y) => {
    x = parseInt(x);
    y = parseInt(y);
    
    // 꼬리 호출 아님
    return 0 + _add(x, y);
}
```

add1()의 경우, _add()가 add1() 함수의 마지막 실행 코드이므로 꼬리 호출이 맞지만, add2() 는 마지막 실행부에 _add()의 결과 값에 0을 더하는 연산이 있어서 꼬리호출이 아니다. 

add1()의 _add()는 실행 스택을 새로 만들지 않고 add1() 함수의 실행 스택을 다시 사용한다. 이것이 꼬리 호출 최적화된 코드이다.



**꼬리 호출 아닌 코드를 꼬리 호출로 전환**



아래의 코드에서 _add()는 꼬리 호출이 아니므로 스택이 2개 쌓인다. 

```javascript
"use strict";

const _add = (x, y) => x + y;
const add = (x, y) => {
    x = parseInt(x);
    y = parseInt(y);
    var result = _add(x, y);
    return result;
}
```



다음과 같이 꼬리 호출로 변경 가능하다. 변수 result를 쓰지 말고 return 문으로 함수 호출을 즉시 반환한다. 이 밖에도 꼬리 호출 전환 기법은 여러가지가 있다.

```javascript
"use strict";

const _add = (x, y) => x + y;
const add = (x, y) => {
    x = parseInt(x);
    y = parseInt(y);
    return _add(x, y);
}
```



[참고할만한 글](http://2ality.com/2015/06/tail-call-optimization.html)