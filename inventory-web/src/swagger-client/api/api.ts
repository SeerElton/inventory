export * from './auth.service';
import { AuthService } from './auth.service';
export * from './root.service';
import { RootService } from './root.service';
export * from './stock.service';
import { StockService } from './stock.service';
export * from './stockQuantity.service';
import { StockQuantityService } from './stockQuantity.service';
export const APIS = [AuthService, RootService, StockService, StockQuantityService];
