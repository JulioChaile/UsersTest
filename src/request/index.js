const API = 'https://jsonplaceholder.typicode.com'

const request = (route, body, callback, error) => fetch(API + route, body)
    .then(r => {
        try {
            r.json().then(callback)
        } catch (error) {
            console.log(error)
            error(error)
        }
    })
    .catch(error)

const bodyRequest = (method, body = null) => {
    const b = {
        method,
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
    }

    if (body) b.body = JSON.stringify(body)

    return b
}

const e = {
    Post: (route, body, callback, error) => {
        const b = bodyRequest('POST', body)

        request(route, b, callback, error)
    },
    Get: (route, body, callback, error) => {
        const b = bodyRequest('GET')

        const routeGet = () => {
            if (!body) return route

            let query = ''

            const keys = Object.keys(body)

            keys.forEach((k, i) => {
                query = query + (i === 0 ? '?' : '&') + k + '=' + body[k]
            })

            return route + query
        }

        request(routeGet(), b, callback, error)
    },
    Put: (route, body, callback, error) => {
        const b = bodyRequest('POST', body)

        request(route, b, callback, error)
    },
    Delete: (route, id, callback, error) => {
        const b = { method: 'DELETE' }

        request(route + '/' + id, b, callback, error)
    }
}

export default e