// DataTable ------------------------------------------------------------------
function DataTable(columns, rows) {
    this._type = 'DataTable';
    this._columns = columns;
    this._rows = rows;
}


// Methods --------------------------------------------------------------------
DataTable.prototype = {

    getColumns: function() {
        return this._columns;
    },

    getRows: function() {
        return this._rows;
    },

    toJSON: function() {
        return {
            type: this._type,
            columns: this.getColumns(),
            rows: this.getRows()
        };
    }

};


// Exports --------------------------------------------------------------------
module.exports = DataTable;

