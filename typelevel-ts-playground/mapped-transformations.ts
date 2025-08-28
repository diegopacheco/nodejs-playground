// Advanced mapped types for object transformations

type OptionalKeys<T> = {
  [K in keyof T]?: T[K];
};

type RequiredKeys<T> = {
  [K in keyof T]-?: T[K];
};

type PickByType<T, U> = {
  [K in keyof T as T[K] extends U ? K : never]: T[K];
};

type OmitByType<T, U> = {
  [K in keyof T as T[K] extends U ? never : K]: T[K];
};

type PrefixKeys<T, P extends string> = {
  [K in keyof T as `${P}${string & K}`]: T[K];
};

type Getters<T> = {
  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K];
};

type Setters<T> = {
  [K in keyof T as `set${Capitalize<string & K>}`]: (value: T[K]) => void;
};

type KeysOfType<T, U> = {
  [K in keyof T]: T[K] extends U ? K : never;
}[keyof T];

// Usage examples
export function demonstrateMappedTransformations() {
  interface User {
    id: number;
    name: string;
    email: string;
    age?: number;
    isActive: boolean;
  }
  
  // Make all properties optional
  type PartialUser = OptionalKeys<User>;
  
  // Make all properties required
  type CompleteUser = RequiredKeys<User>;
  
  // Pick only string properties
  type StringFields = PickByType<User, string>; // { name: string; email: string }
  
  // Omit string properties
  type NonStringFields = OmitByType<User, string>; // { id: number; age?: number; isActive: boolean }
  
  // Add prefix to all keys
  type UserWithPrefix = PrefixKeys<User, "user_">; // { user_id: number; user_name: string; ... }
  
  // Generate getters
  type UserGetters = Getters<User>; // { getId(): number; getName(): string; ... }
  
  // Generate setters
  type UserSetters = Setters<User>; // { setId(value: number): void; setName(value: string): void; ... }
  
  // Get keys of specific type
  type StringKeys = KeysOfType<User, string>; // "name" | "email"
  
  console.log("Mapped transformations showcase completed");
}