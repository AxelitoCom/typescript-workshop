//noinspection JSUnusedGlobalSymbols

import {expectTypeOf} from "vitest";

/**
 * Basiques
 *
 * Dans ce premier exercice, remplacer ______ par le type souhaité
 */

export function testBasics() {
  /**
   * Les types primitifs
   */
  const firstName: string = "Charlotte"; // "Charlotte" is a text value
  expectTypeOf(firstName).toEqualTypeOf("Charlotte");
  const age: number = 30; // Age is a number
  expectTypeOf(age).toEqualTypeOf(30);
  const isEven = (num: number) => num % 2 === 0;
  const isLoggedIn: boolean = true; // True/false value
  expectTypeOf(isLoggedIn).toEqualTypeOf(isEven(2));
  const emptyValue: null = null; // Represents intentional absence
  expectTypeOf(emptyValue).toEqualTypeOf(null);
  const notAssignedYet: undefined = undefined; // Declared but not yet given a value
  expectTypeOf(notAssignedYet).toEqualTypeOf(undefined);
  const uniqueId: symbol = Symbol("id"); // Unique and immutable identifier
  expectTypeOf(uniqueId).toEqualTypeOf(Symbol("id"));
  // (note: needs ES2020 or later)
  let reallyBigNumber: bigint = 1234567890123456789012345678901234567890n;
  expectTypeOf(reallyBigNumber).toEqualTypeOf(
      1234567890123456789012345678901234567890n
  );
}

/**
 * Les types par références
 */
export function testReferences() {
  /**
   * Array
   */
  const scores: number[] = [85, 92, 78];
  expectTypeOf(scores).toEqualTypeOf([85, 92, 78]);
  const fruits: string[] = ["apple", "banana", "cherry"]; // Hint: strings only
  expectTypeOf(fruits).toEqualTypeOf(["apple", "banana", "cherry"]);
  // Syntaxe générique
  const answers: Array<boolean> = [true, false, true];
  expectTypeOf(answers).toEqualTypeOf([true, false, true]);
  /**
   * Tuples
   */
  const tuple: Array<string | number> = ["Alice", 25];
  expectTypeOf(tuple).toMatchTypeOf(["Alice", 25]);
  /**
   * Les objets
   */
  const user: {
    name: string;
    age: number;
    isEmployed: boolean;
  } = {
    name: "Eléanore",
    age: 30,
    isEmployed: true,
  };
  expectTypeOf(user).toEqualTypeOf({
    name: "Max",
    age: 42,
    isEmployed: false,
  });
  const company: {
    name: string;
    address: {
      city: string;
      zip: number;
    };
  } = {
    name: "Devoxx",
    address: {
      city: "Paris",
      zip: 75000,
    },
  };
  expectTypeOf(company).toEqualTypeOf({
    name: "Comet",
    address: {
      city: "Paris",
      zip: 75002,
    },
  });
}

/**
 * Type of, keyof, lookup type
 */
export function testOperators() {
  /**
   * typeof
   */
  const username = '';
  type UsernameType = typeof username;
  expectTypeOf<UsernameType>().toMatchTypeOf<string>();
  const config = {
    darkMode: true,
    version: 1
  };
  type ConfigType = typeof config;
  expectTypeOf<ConfigType>().toEqualTypeOf<{
    darkMode: boolean;
    version: number;
  }>();
  /**
   * keyof
   */
  type User = {
    id: string;
    name: string;
    email: string;
  };
  type UserKeys = keyof User;
  expectTypeOf<UserKeys>().toEqualTypeOf<"id" | "name" | "email">();
  /**
   * lookup type
   */
  type Company = { name: string }
  type CompanyNameType = Company["name"];
  expectTypeOf<CompanyNameType>().toEqualTypeOf<string>();
}

/**
 * Les types génériques
 */
export function testGenericsTypes() {
  /**
   * Utiliser un type générique pour typer la sortie
   */
  function parseJSON<T>(input: string): T {
    return JSON.parse(input)
  }

  const inferredFromOutput: { otherProp: string } = parseJSON('{otherProp:"tata"}');
  expectTypeOf(inferredFromOutput).toEqualTypeOf<{ otherProp: string }>();

  const explicitGenericOutput = parseJSON<{ prop: string }>('{prop:"toto"}');
  expectTypeOf(explicitGenericOutput).toEqualTypeOf<{ prop: string }>();

  /**
   * Utiliser un type générique pour typer un paramètre
   */
  function addProp<T extends Record<string, string>>(input: T) {
    return {...input, newProp: 'yeahh'}
  }

  const inferredFromInput = addProp({toto: "tata" as const});
  expectTypeOf(inferredFromInput).toMatchTypeOf<{ toto: "tata"; newProp: string }>();

  const explicitGenericInput = addProp<{ prop1: string }>({prop1: "toto"});
  expectTypeOf(explicitGenericInput).toMatchTypeOf<{ prop1: string; newProp: string }>();

  /**
   * Utiliser plusieurs types génériques
   */
  function transform<Input, Output>(input: Input, fn: (input: Input) => Output): Output {
    return fn(input)
  }

  function stringify(data: any) {
    return String(data)
  }

  function length(data: string) {
    return data.length
  }

  const transformStringifyOutput = transform(42, stringify)
  expectTypeOf(transformStringifyOutput).toEqualTypeOf<string>();

  const transformLengthOutput = transform("four", length)
  expectTypeOf(transformLengthOutput).toEqualTypeOf<number>();

  /**
   * Ajouter des contraintes
   */
  function lookup<DataType, PropType extends keyof DataType>(data: DataType, prop: PropType) {
    return data[prop]
  }

  const userName = lookup({name: "Max", age: 42}, 'name')
  expectTypeOf(userName).toEqualTypeOf<string>();

  const stringLength = lookup("four", "length")
  expectTypeOf(stringLength).toEqualTypeOf<number>();
}

export function testLiteralTypes() {
  /**
   * Construire un type template
   */
  type FirstName = "Alice" | "Bob";
  type LastName = "Erlandwon" | "Razowsky";
  type AllFullNames = `${FirstName} ${LastName}`;
  expectTypeOf<AllFullNames>().toEqualTypeOf<"Alice Erlandwon" | "Alice Razowsky" | "Bob Erlandwon" | "Bob Razowsky">();
  /**
   * Inférer depuis un template
   */
  type ExtractFeeling<Statement> = Statement extends `${string} ${infer feeling} ${string}` ? feeling : "";
  type BobFeeling = ExtractFeeling<"Bob likes Alice">;
  type AliceFeeling = ExtractFeeling<"Alice hates Bob">;
  expectTypeOf<BobFeeling>().toEqualTypeOf<"likes">();
  expectTypeOf<AliceFeeling>().toEqualTypeOf<"hates">();
}
