import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ConfigService } from '@nestjs/config'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { ValidationPipe } from '@nestjs/common'
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface'
import { TransformInterceptor } from '@/shared/interceptors/transform-response.interceptor'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug'],
  })

  const configService = app.get(ConfigService)
  const env = configService.get('environment')

  const corsOption: CorsOptions = {}
  if (env === 'prod') {
    corsOption.origin = configService.get('allowedCorsOrigin')
  } else {
    corsOption.origin = '*'
  }
  app.enableCors(corsOption)

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  )
  app.useGlobalInterceptors(new TransformInterceptor())

  app.enableShutdownHooks()

  const options = new DocumentBuilder()
    .setTitle('KAC-API')
    .setDescription('K-Artist Class API')
    .setVersion('0.0.1')
    .build()
  const document = SwaggerModule.createDocument(app, options)
  SwaggerModule.setup('api-docs', app, document, {
    customSiteTitle: 'KAC-API Docs',
  })

  const port = configService.get('port')
  await app.listen(port, () => {
    console.log(`${env} server listening on ${port}`)
  })
}
bootstrap()
