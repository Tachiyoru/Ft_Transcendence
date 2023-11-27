import {
  Strategy as OAuth2Strategy,
  StrategyOptions as OAuth2StrategyOptions,
  VerifyFunction,
} from "passport-oauth2";

type PartialOmit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>> &
  Partial<Pick<T, K>>;

interface Profile {
  id: string;
  username: string;
  displayName: string;
  emails: Array<{ value: string }>;
  photos: Array<{ value: string }>;
}

type StrategyOptions = PartialOmit<
  OAuth2StrategyOptions,
  "authorizationURL" | "tokenURL"
> & {
  profileFields?: {
    [K: string]: boolean | string | (<T = any>(obj: Profile) => T);
  };
};

declare class FortyTwoStrategy extends OAuth2Strategy {
  constructor(options: StrategyOptions, verify: VerifyFunction);
}

export { FortyTwoStrategy };

export { FortyTwoStrategy as Strategy, StrategyOptions };
