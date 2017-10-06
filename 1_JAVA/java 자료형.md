java 자료형

Number

정수 : 자바의 정수를 표현하기 위해 주로 사용하는 자료형은 int, long 이다.

| 자료형   | 단위      | 표현범위                                     |
| ----- | ------- | ---------------------------------------- |
| byte  | 1 byte  | -128 ~ 127                               |
| short | 2 bytes | -32768 ~ 32767                           |
| int   | 4 bytes | -2147483648 ~ 2147483647 (-2^31 ~ 2^31)  |
| long  | 8 bytes | -9223372036854775808 ~ 9223372036854775807 (-2^63 ~ 2^63) |

```java
int age = 10;

// long형은 숫자뒤에 L을 붙인다. 소문자l은 헷갈릴 수 있으니 자제한다.
long something = 234234234234234L;
```



실수 : 자바의 실수를 표현하기 위한 자료형은 float, double이다.

| 자료형    | 단위      | 표현범위                              |
| ------ | ------- | --------------------------------- |
| float  | 4 bytes | 1.4E-45 ~ 3.4028235E38            |
| double | 8 bytes | 4.9E-324 ~ 1.7976931348623157E308 |



```java
// float형은 뒤에 F를 붙인다. 
float pi = 3.14F;
double morePi = 3.14159265358979323846;
double d1 = 1.123123123e4;  // 과학적 지수 표현식 e4 == 10^4
```



8진수와 16진수

8진수와 16진수는 int 자료형을 사용하여 표기할 수 있다.

0으로 시작하면 8진수, 0x으로 시작하면 16진수가 된다.

```ㅓjava
int octal = 023;  // 19
int hex = 0xc;  // 12
```



Boolean

boolean은 1byte이며 표현범위는 true 또는 false 이다. 부울 자료형은 true 또는 false만 가능하다.

```java
boolean isSuccess = true;
boolean isTest = false;
```



char

char은 한개의 문자 값에 대한 자료형이며 2 bytes이고 표현 범위는 '\u0000' ~ 'uFFFF' (16비트 유니코드 문자 데이터) 이다.

```java
// 문자값을 ' 으로 감싸주어야 한다.

char a1 = 'a';  // 문자값
char a2 = 97;   // 아스키코드값
char a3 = '\u0061';  // 유니코드값

// 위는 모두 a를 나타낸다.
```



String(문자열)



String

StringBuffer

Array

List

Generics

Map















