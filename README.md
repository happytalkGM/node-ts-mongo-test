# mongo driver test

## Requirement
- nodejs (20 이상)
- typescript
- mongoDB 및 테스트 데이터 구성

## Build
```shell
npm run build
```

## execute
```shell
# mongoDB official driver
npm run start:official-driver

# deepkit 원본 (기본적인 사용 사례)
npm run start:deepkit

# deepkit 원본 + min pool size 확보
npm run start:deepkit-initial-pool

# deepkit custom
npm run start:deepkit-custom
```

## deepkit 인증 암호화 캐싱 처리
- Command 실행시마다 인증을 수행하며, auth payload의 암호화를 매번 진행
- 해당 과정에서 event loop가 blocking되며, 상당량의 CPU 자원을 소모함 

```text
수정된 파일: src/lib/mongo/src/client/command/auth/scram.ts
(node_modules/@deepkit/mongo/dist/cjs/src/client/command/auth/scram.js)

수정된 함수: function HI(data, salt, iterations, cryptoAlgorithm)
```