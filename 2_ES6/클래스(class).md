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