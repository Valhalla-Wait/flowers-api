// NOTE
// В основе гуардов стоит общий пользовательский jwt-global
//
// Если какой-либо метод имеет декоратор-валидатор администратора или интегратора,
// то в глобальном декораторе проверяются мета-данные администратора или интегратора
// и при наличии такие мета-данные canActivate сразу ставиться как true
//
// Перед тем как как поставить мета-данные администратора или интегратора,
// должны произойти проверки токенов внутри декораторов. Это локальная отвественность декоратора

export const IS_ADMIN_KEY = 'isAdmin';
export const IS_PUBLIC_KEY = 'isPublic';

export const GUARD_SERVICE = 'guardService';

export enum JwtAccessType {
  ADMIN = 'jwt-admin',
  GLOBAL = 'jwt-global',
}

//
//
//

export const JwtAdminServiceSymbol = Symbol.for('JwtAdminService');
export const JwtGlobalServiceSymbol = Symbol.for('JwtGlobalService');
