const { format } = require('date-fns')

module.exports = {
    formartarData(data) {
        return format(data, `yyyy-MM-dd H:mm:ss`)
    },

}