import { UserState } from './user';
import { AdminState } from './admin';

export interface ConnectState {
  user: UserState;
  admin: AdminState;
}
const context = require.context('./', true, /\.ts$/);

export default context
  .keys()
  .filter((item) => item !== './index.ts' && !~item.indexOf('.d.ts'))
  .map((key) => context(key));
