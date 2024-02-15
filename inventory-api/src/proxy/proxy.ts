import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { createProxyMiddleware } from 'http-proxy-middleware';

@Module({})
export class ProxyMiddlewareModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        const targetUrl = 'http://api.example.com'; // Replace with your API's base URL

        const options = {
            target: targetUrl,
            changeOrigin: true,
            secure: false, // Set to `true` if your API uses HTTPS
            pathRewrite: {
                '^/api': '', // Rewrite '/api' to remove it from the URL
            },
        };

        consumer
            .apply(createProxyMiddleware(options))
            .forRoutes('*');
    }
}
