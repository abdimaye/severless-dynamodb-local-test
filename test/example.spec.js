const assert = require('assert')
const chai = require('chai')
const chaiHttp = require('chai-http')
const expect = chai.expect

chai.use(chaiHttp)

const AWS = require('aws-sdk')
const docClient = new AWS.DynamoDB.DocumentClient(
    {region: 'localhost', endpoint: 'http://localhost:8000'}
);


// before( done => {
//     done()
// })

// after( done => {
//     done()
// })

describe('Example test', function() {
    // set base url
    const request = chai.request('http://localhost:3000')
    const table = 'users-table-dev'

    it('can get home', () => {
        request.get('/')
            .end( (err, res) => {
                assert.equal(res.text, 'Hello Serverless!')
            })
    })

    it('can create new user', () => {
        const item = {
            userId: 'abdi1234',
            name: 'abdim',
        }

        request.post('/users')
            .send(item)
            .end( (err, res) => {
                assert.equal(res.statusCode, 200)
                assert.equal(res.body.userId, item.userId)
            })
    })

    it('can get existing user', () => {
        const item = {
            TableName: table,
            Item: {
                userId: 'abditest',
                name: 'abdim_test',
            }
        }

        docClient.put(item, function(error, data) {
            if (error) console.log(error)
        })

        request.get(`/users/${item.Item.userId}`)
            .end( (err, res) => {
                assert.equal(res.statusCode, 200)
                assert.equal(res.body.userId, item.Item.userId)
            })
    })
})