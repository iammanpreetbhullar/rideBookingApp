import React from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

class DataGrid extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            filters: null,
        }
    }

    render() {
        const dynamicColumns = this.props.columns ? this.props.columns.map((col, i) => {
            return (
                <Column
                    key={i}
                    field={col.field ? col.field : null}
                    header={col.header ? col.header : null}
                    body={col.body ? col.body : null}
                    style={col.style ? col.style : null}
                    editor={col.editor ? col.editor : null}
                    rowEditor={col.rowEditor ? col.rowEditor : null}
                    bodyStyle={col.bodyStyle ? col.bodyStyle : null}
                    headerStyle={col.headerStyle ? col.headerStyle : null}
                    sortable={col.sortable ? col.sortable : null}
                />
            );
        }) : null;

        return (
            <DataTable
                value={this.props.value ? this.props.value : null}
                stripedRows={this.props.stripedRows ? this.props.stripedRows : null}
                size={this.props.size ? this.props.size : null}
                responsiveLayout={this.props.responsiveLayout ? this.props.responsiveLayout : null}
                paginator={this.props.paginator ? this.props.paginator : null}
                paginatorTemplate={this.props.paginatorTemplate ? this.props.paginatorTemplate : null}
                first={this.props.first ? this.props.first : null}
                onPage={this.props.onPage ? this.props.onPage : null}
                paginatorClassName={this.props.paginatorClassName ? this.props.paginatorClassName : null}
                className="p-datatable-customers"
                showGridlines={this.props.showGridlines ? this.props.showGridlines : null}
                rows={this.props.rows ? this.props.rows : null}
                editMode={this.props.editMode ? this.props.editMode : null}
                editingRows={this.props.editingRows ? this.props.editingRows : null}
                onRowEditChange={this.props.onRowEditChange ? this.props.onRowEditChange : null}
                onRowEditComplete={this.props.onRowEditComplete ? this.props.onRowEditComplete : null}
                dataKey={this.props.dataKey ? this.props.dataKey : null}
                filters={this.props.filtering ? this.props.filters ? this.props.filters : this.state.filters : null}
                loading={this.props.loading ? this.props.loading : null}
                globalFilterFields={this.props.globalFilterFields ? this.props.globalFilterFields : null}
                header={this.props.header ? this.props.header : null}
                emptyMessage={this.props.emptyMessage ? this.props.emptyMessage : null}
                removableSort={this.props.removableSort ? this.props.removableSort : null}
                onSort={this.props.onSort ? this.props.onSort : null}
                sortField={this.props.sortField ? this.props.sortField : null}
                sortOrder={this.props.sortOrder ? this.props.sortOrder : null}
                scrollable={this.props.scrollable ? this.props.scrollable : null}
                scrollHeight={this.props.scrollHeight ? this.props.scrollHeight : null}
            >
                {dynamicColumns}
            </DataTable>
        )
    }
}

export default DataGrid;