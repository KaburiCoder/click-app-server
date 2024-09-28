import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable()
export class GrpcLoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const handlerName = context.getHandler().name; // 핸들러 이름
    const rpcContext = context.switchToRpc(); // gRPC 컨텍스트
    const args = rpcContext.getContext();
    const metadata = args.internalRepr as Map<string, string[]>;

    // 요청 로그 기록
    const now = Date.now(); // 시작 시간

    // 응답 처리 전후에 로그 기록
    return next.handle().pipe(
      tap((data) => {
        // 요청 및 응답 로그 기록
        console.log(`[gRPC] Request received: ${handlerName}`, `Metadata: ${JSON.stringify([...metadata])}`, `[gRPC] Response sent: ${handlerName}`, `[gRPC] Processing time: ${Date.now() - now}ms`);
      }),
      catchError((err) => {
        console.error(`[gRPC] Request received: ${handlerName}`, `Metadata: ${JSON.stringify([...metadata])}`, `[gRPC] Error: ${handlerName}`, err);
        throw err;
      }),
    );
  }
}
