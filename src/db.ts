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

export const selectFrom = <
    CTX extends CtxDb<any>,
    TABLE extends keyof CTX['$db']
>(ctx: CTX, tableName: TABLE) => ({
    ...ctx,
    _operation: "select" as const,
    _table: tableName,
});


type SelectableContext<Ctx> = CtxDb<Ctx> & {
    _operation: "select";
    _table: keyof Ctx;
};

type AnySelectableContext = SelectableContext<any>;
type Fields<Ctx extends AnySelectableContext> = keyof Ctx['$db'][Ctx['_table']];

export const selectFields = <
    Ctx extends AnySelectableContext,
    Field extends Fields<Ctx>
>(ctx: Ctx, fieldNames: Field[]) => ({
    ...ctx,
    _fields: fieldNames,
});

export const selectAll = <Ctx extends AnySelectableContext>(ctx: Ctx) => ({
    ...ctx,
    _fields: "ALL" as const,
});

export const where = <
    Ctx extends AnySelectableContext,
    Field extends Fields<Ctx>
>(
    ctx: Ctx,
    field: Field,
    operator: "=",
    value: Ctx['$db'][Ctx['_table']][Field]) => (
    {
        ...ctx,
        _where: {
            field,
            operator,
            value,
        },
    });

export const deleteFrom = (ctx: any, tableName: any) => ({
    ...ctx,
    _operation: "delete",
    _table: tableName,
});
