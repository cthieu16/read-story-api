import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    return next.handle().pipe(map(this.wrapData));
  }

  private wrapData = (data: any): any => {
    if (Array.isArray(data)) {
      return {
        statusCode: 200,
        message: 'Successfully',
        data: data.map(this.transformItem),
      };
    }

    return {
      statusCode: 200,
      message: 'Successfully',
      data: this.transformItem(data),
    };
  };

  private transformItem = (item: any): any => {
    if (item) {
      if (item.toObject) {
        item = item.toObject();
      }

      if (item._id) {
        item.id = item._id.toString();
        delete item._id;
      }

      delete item.__v;
    }
    return item;
  };
}
