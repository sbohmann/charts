fs = require('fs')

const points = fs.
    readFileSync('raw_data/timeline-faelle-ems.csv', 'utf-8')
    .split(/\n/)
    .flatMap(line => {
        let match = line.match(/.*Österreich;(\d+)/)
        if (match) {
            return [match[1]]
        }
        return []
    })

console.log(points)

fs.writeFileSync('data/inzidenzen.json', JSON.stringify({
    name: "Inzidenzen",
    points
}))


fs.writeFileSync('data/inzidenzen_durch_100.json', JSON.stringify({
    name: "Inzidenzen",
    points: points.map(value => value / 100)
}))
