// Table
export type UserTable = {
    id: string;
    firstName: string;
    lastName: string;
    birthDate: Date;
};

// Table
export type CompanyTable = {
    id: string;
    name: string;
};

// DB
export type CustomerDatabase = {
    users: UserTable;
    companies: CompanyTable;
};

type Price = number;

// Table
export type ProductTable = {
    id: string;
    name: string;
    description: string;
    unitPrice: Price;
};

// Table
export type CartTable = {
    id: string;
    items: ProductTable["id"][];
};

// DB
export type ShoppingDatabase = {
    carts: CartTable;
    products: ProductTable;
};

export const buildContext = <DB>() => {
    return {
        $db: undefined as DB
    };
};

type CtxDb<DB> = { $db: DB };
type Database = CtxDb<any>;

// Alias pour les tables
type AliasTable<Table> = `${Table & string} ${string}`;
type TableOrAlias<Table> = Table | AliasTable<Table>;
type AnyTable<Ctx extends Database> = TableOrAlias<keyof Ctx["$db"]>;

export const selectFrom = <
    Ctx extends Database,
    Table extends AnyTable<Ctx>
>(ctx: Ctx, tableName: Table) => ({
    ...ctx,
    _operation: "select" as const,
    _table: tableName,
});


type SelectableContext<Ctx> = CtxDb<Ctx> & {
    _operation: "select";
    _table: keyof Ctx;
};

type DeletableContext<DB> = CtxDb<DB> & {
    _operation: "delete";
    _table: keyof DB;
};

type CtxOperations = SelectableContext<any> | DeletableContext<any>;
type Tables<Ctx extends CtxOperations> = Ctx['$db'][Ctx['_table']];
type Fields<Ctx extends CtxOperations> = keyof Tables<Ctx>;

// Alias champs
type AliasChamp<Champ> = Champ | `${Champ & string} as ${string}`;
type ChampOuAlias<Table, Champ> = AliasChamp<Champ> | `${Table & string}.${AliasChamp<Champ> & string}`;
type Champ<Ctx extends CtxOperations> =
    Ctx['_table'] extends `${infer Table} ${infer Alias}` ?
        ChampOuAlias<Alias, keyof Ctx['$db'][Table]>
        :
        ChampOuAlias<Ctx['_table'], Fields<Ctx>>

export const selectFields = <
    Ctx extends SelectableContext<any>,
    Field extends Champ<Ctx>
>(ctx: Ctx, fieldNames: Field[]) => ({
    ...ctx,
    _fields: fieldNames,
});

export const selectAll = <Ctx extends SelectableContext<any>>(ctx: Ctx) => ({
    ...ctx,
    _fields: "ALL" as const,
});

export const where = <
    Ctx extends CtxOperations,
    Field extends Fields<Ctx>
>(
    ctx: Ctx,
    field: Field,
    operator: "=",
    value: Tables<Ctx>[Field]) => (
    {
        ...ctx,
        _where: {
            field,
            operator,
            value,
        },
    });

export const deleteFrom = <
    Ctx extends Database,
    Table extends keyof Tables<DeletableContext<Ctx>>
>(ctx: Ctx, tableName: Table) => ({
    ...ctx,
    _operation: "delete" as const,
    _table: tableName,
});
