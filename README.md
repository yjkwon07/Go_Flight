# Go_Flight
- [nodemone](https://github.com/yjkwon07/Go_Flight#nodemone)
- [dotenv](https://github.com/yjkwon07/Go_Flight#dotenv)
- [flash](https://github.com/yjkwon07/Go_Flight#flash)
- [passport](https://github.com/yjkwon07/Go_Flight#passport)
- [sequelize](https://github.com/yjkwon07/Go_Flight#sequelize)
- [directory](https://github.com/yjkwon07/Go_Flight#directory)
- [multer](https://github.com/yjkwon07/Go_Flight#multer)

## nodemone
- Development

nodemone은 서버 코드가 바뀔 때 알아서 재시작해서 편하다.

**[위로](https://github.com/yjkwon07/Go_Flight#go_flight)**

## dotenv
dot(.) + env여서 dotenv 

**`.env`** 파일에 키=값 형식으로 비밀번호를 저장한다. 
```javascript
    require('dotenv').config()
    -> process.env에 들어간다. 
    -> 파싱이 가능하다. 
    -> 보안 위험도를 줄이기 위함
```

**[위로](https://github.com/yjkwon07/Go_Flight#go_flight)**

## flash 
임시로 데이터를 저장하고 페이지 이동 시 데이터 소멸 (cookie 기능)

**`connect-flash`** 미들웨어는 **`cookie-parser`** 와 **`express-session`** 을 사용하므로 이들보다는 뒤에 위치해야 합니다.
```javascript
    const flash = require('connect-flash');
    app.use(flash());
```

**[위로](https://github.com/yjkwon07/Go_Flight#go_flight)**

## passport
- [passport](https://github.com/yjkwon07/Go_Flight/blob/master/inform/passport.md)

**[위로](https://github.com/yjkwon07/Go_Flight#go_flight)**

## sequelize
- [sequelize](https://github.com/yjkwon07/Go_Flight/blob/master/inform/sequelize.md)

**[위로](https://github.com/yjkwon07/Go_Flight#go_flight)**

## directory 
- [directory](https://github.com/yjkwon07/Go_Flight/blob/master/inform/dircetory.md)

**[위로](https://github.com/yjkwon07/Go_Flight#go_flight)**

## multer
- [multer](https://github.com/yjkwon07/Go_Flight/blob/master/inform/multer.md)

**[위로](https://github.com/yjkwon07/Go_Flight#go_flight)**

