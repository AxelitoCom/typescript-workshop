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

export const selectFields = (ctx: any, fieldNames: any[]) => ({
    ...ctx,
    _fields: fieldNames,
});

export const selectAll = (ctx: any) => ({
    ...ctx,
    _fields: "ALL",
});

export const where = (ctx: any, field: any, operator: "=", value: any) => ({
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
