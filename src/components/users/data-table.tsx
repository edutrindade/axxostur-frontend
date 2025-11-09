import {
	type ColumnDef,
	flexRender,
	getCoreRowModel,
	getPaginationRowModel,
	useReactTable,
} from "@tanstack/react-table";

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Skeleton } from "@/components/ui/skeleton";

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
	isLoading?: boolean;
	onToggleStatus?: (user: TData) => void;
}

export function DataTable<TData, TValue>({
	columns,
	data,
	isLoading = false,
}: DataTableProps<TData, TValue>) {
	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		initialState: {
			pagination: {
				pageSize: 10,
			},
		},
	});

	return (
		<div className="space-y-8">
			<div className="w-full overflow-x-auto">
				<Table className="min-w-full">
				<TableHeader>
					{table.getHeaderGroups().map((headerGroup) => (
						<TableRow key={headerGroup.id}>
							{headerGroup.headers.map((header) => {
								return (
									<TableHead key={header.id}>
										{header.isPlaceholder
											? null
											: flexRender(
													header.column.columnDef.header,
													header.getContext(),
												)}
									</TableHead>
								);
							})}
						</TableRow>
					))}
				</TableHeader>
				<TableBody>
					{isLoading ? (
						Array.from({ length: 5 }).map((_, index) => (
							<TableRow key={index.toString()}>
								{columns.map((_, colIndex) => (
									<TableCell key={colIndex.toString()}>
										<Skeleton className="h-8 w-full bg-slate-300 rounded-lg" />
									</TableCell>
								))}
							</TableRow>
						))
					) : table.getRowModel().rows?.length ? (
						table.getRowModel().rows.map((row) => (
							<TableRow
								key={row.id}
								data-state={row.getIsSelected() && "selected"}
							>
								{row.getVisibleCells().map((cell) => (
									<TableCell key={cell.id}>
										{flexRender(
											cell.column.columnDef.cell,
											cell.getContext(),
										)}
									</TableCell>
								))}
							</TableRow>
						))
					) : (
						<TableRow>
							<TableCell
								colSpan={columns.length}
								className="h-32 text-center text-slate-700 font-semibold"
							>
								<div className="flex flex-col items-center gap-3">
									<Icon name="search" size={32} className="text-slate-500" />
									<span className="text-lg">Nenhum resultado encontrado.</span>
								</div>
							</TableCell>
						</TableRow>
					)}
				</TableBody>
				</Table>
			</div>

			<div className="flex items-center justify-between px-6 py-6 bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl border-2 border-slate-200 shadow-sm">
				<div className="flex-1 text-sm text-slate-700 font-semibold">
					{/* {table.getFilteredSelectedRowModel().rows.length} de {table.getFilteredRowModel().rows.length} linha(s) selecionada(s). */}
				</div>
				<div className="flex items-center space-x-8 lg:space-x-10">
					<div className="flex items-center space-x-3">
						<p className="text-sm font-bold text-slate-800">Linhas por página</p>
						<select
							value={table.getState().pagination.pageSize}
							onChange={(e) => {
								table.setPageSize(Number(e.target.value));
							}}
							className="h-10 w-[80px] rounded-lg border-2 border-slate-300 bg-white px-3 py-2 text-sm font-bold text-slate-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 hover:border-slate-400 transition-colors"
						>
							{[10, 20, 30, 40, 50].map((pageSize) => (
								<option key={pageSize} value={pageSize}>
									{pageSize}
								</option>
							))}
						</select>
					</div>
					<div className="flex w-[120px] items-center justify-center text-sm font-bold text-slate-800">
						Página {table.getState().pagination.pageIndex + 1} de{" "}
						{table.getPageCount()}
					</div>
					<div className="flex items-center space-x-3">
						<Button
							variant="outline"
							className="hidden h-10 w-10 p-0 lg:flex border-2 border-slate-300 hover:border-slate-400 hover:bg-slate-100 text-slate-700 hover:text-slate-900 font-semibold"
							onClick={() => table.setPageIndex(0)}
							disabled={!table.getCanPreviousPage()}
						>
							<span className="sr-only">Ir para primeira página</span>
							<Icon name="chevronLeft" size={18} />
						</Button>
						<Button
							variant="outline"
							className="h-10 w-10 p-0 border-2 border-slate-300 hover:border-slate-400 hover:bg-slate-100 text-slate-700 hover:text-slate-900 font-semibold"
							onClick={() => table.previousPage()}
							disabled={!table.getCanPreviousPage()}
						>
							<span className="sr-only">Ir para página anterior</span>
							<Icon name="chevronLeft" size={18} />
						</Button>
						<Button
							variant="outline"
							className="h-10 w-10 p-0 border-2 border-slate-300 hover:border-slate-400 hover:bg-slate-100 text-slate-700 hover:text-slate-900 font-semibold"
							onClick={() => table.nextPage()}
							disabled={!table.getCanNextPage()}
						>
							<span className="sr-only">Ir para próxima página</span>
							<Icon name="chevronRight" size={18} />
						</Button>
						<Button
							variant="outline"
							className="hidden h-10 w-10 p-0 lg:flex border-2 border-slate-300 hover:border-slate-400 hover:bg-slate-100 text-slate-700 hover:text-slate-900 font-semibold"
							onClick={() => table.setPageIndex(table.getPageCount() - 1)}
							disabled={!table.getCanNextPage()}
						>
							<span className="sr-only">Ir para última página</span>
							<Icon name="chevronRight" size={18} />
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
