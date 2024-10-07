# Step 1: Build Stage
FROM node:20.11.1-alpine3.19 AS builder

# 작업 디렉토리 생성
WORKDIR /var/app

# 패키지 파일만 먼저 복사하여 종속성 설치 (캐싱 활용)
COPY package*.json ./

# 패키지 설치
RUN npm install --frozen-lockfile

# Prisma 스키마 파일 복사
COPY prisma ./prisma/

# 소스코드 복사
COPY . .

# 환경 변수 파일을 모두 복사
COPY .env* ./

# Prisma 클라이언트 생성
RUN npx prisma generate

# 애플리케이션 빌드 (예: TypeScript -> JavaScript)
RUN npm run build

# Step 2: Production Stage
FROM node:20.11.1-alpine3.19

# 작업 디렉토리 생성
WORKDIR /var/app

# 프로덕션 의존성만 설치
COPY package*.json ./
RUN npm install --frozen-lockfile --production

# 빌드된 파일 복사
COPY --from=builder /var/app/dist ./dist

# Prisma 클라이언트 및 스키마 파일 복사
COPY --from=builder /var/app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /var/app/prisma ./prisma
COPY --from=builder /var/app/node_modules/@prisma ./node_modules/@prisma

# 마이그레이션 적용
RUN npx prisma migrate deploy

# 포트 노출
EXPOSE 8080

# 애플리케이션 실행
CMD [ "node", "dist/main.js" ]
