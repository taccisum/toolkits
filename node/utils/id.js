const uuid = require('uuid')

let next_id = 1

module.exports = {
    uuid(len) {
        let id = uuid.v4().replace(/-/g, '')
        if (len > 0) {
            return id.substring(0, len)
        }
        return id
    },
    /**
     * @returns next number-like id that will auto increment in current process
     */
    incr() {
        let current = next_id++
        return current
    }
}
