import { CurrentUserId } from 'src/auth/decorators';
import { FetchUserPipe } from '../pipes';

/**
 * Fetch user data from CurrentUserId
 * @returns User
 */
export const CurrentUser = () => CurrentUserId(FetchUserPipe);
