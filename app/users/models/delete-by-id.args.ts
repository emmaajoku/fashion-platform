export class DeleteByIdArgs {
  id: string;
}

export class DeleteByIdsArgs {
  ids: string[];
}

export class DeleteByIdArgs_Admin extends DeleteByIdArgs {
  userId: string;
}

export class DeletecustomersByIdArgs {
  userId: string;
}
