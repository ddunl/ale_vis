
let margin = {top: 10, right: 30, bottom: 30, left: 60}

let width = 500 - margin.left - margin.right;
let height = 500 - margin.top - margin.bottom;

let x = d3.scaleLinear()
	.domain([0, 3000])
	.range([ 0, width ]);

let y = d3.scaleLinear()
	.domain([0, 1])
	.range([height, 0]);

let color = d3.scaleLinear()
	.domain([0, 1])
	.range([255, 0])


const unique = (value, index, self) => self.indexOf(value) === index; 

const make_url = (d) => {
	let base = "https://www.kmjn.org/temp/ale2/"
	let game = d.Game;
	let depth = d["Rollout depth"]
	let limit = d["Turn limit"]
	let time = d["Time limit"].substring(1)
	let skip = d.Frameskip
	return `${base + game}_depth${depth}_limit${limit}_time${time}_skip${skip}.mp4`
}

d3.csv("all_results_norm.csv", csv => {
	const unique = (value, index, self) => self.indexOf(value) === index; 
	const games = csv.map(x => x.Game).filter(unique);
	//populate dropdown
	d3.select("#dropdown")
		.selectAll("games")
		.data(games)
		.enter()
		.append("option")
			.attr("value", d => d)
			.html(d => d)

	d3.select("#dropdown")
		.on("change", () => update(csv))
	
	//video on change
	d3.select("video")
		.on("mouseout", d => d3.select("video").style("display", "none"))

	let svg = d3.select("#main")
		.append("svg")
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
		.append("g")
			.attr("transform", `translate(${margin.left}, ${margin.top})`);
	// Add X axis
	svg.append("g")
		.attr("transform", `translate(0,${height})`)
		.call(d3.axisBottom(x));

	// Add Y axis
	svg.append("g")
		.call(d3.axisLeft(y));

	update(csv)
})

const update = (csv) => {
	const game = d3.select("#dropdown").node().value
	const data = csv.filter(d => d.Game == game)
	
	d3.select("svg")
		.select("g")
		.selectAll("a")
		.remove()

	const sel = d3.select("svg")
		.select("g")
		.selectAll("a")
		.data(data)
	
	sel.enter()
		.append("a")
		.merge(sel)
			.attr("href", make_url)
			// need to use function over arrow syntax to get right 'this'
			.on('mouseover', function(d) {
				d3.select("#vidsource")
					.attr("src", make_url(d))
				
				let [x, y] = d3.mouse(this)
				d3.select("#video")
					.style("left", x+"px")
					.style("top", y+"px")
					.style("display", "block")

				d3.select("#video")
					.node().load()
					
			})
			.append("circle")
				.attr("cx", d => x(+d["Rollout depth"]) )
				.attr("cy", d => y(+d["Time limit"]) )
				.attr("r", d => 3)
				.style("fill", d => {
					let score = d["Normscore"]
					let r = color(score)
					let g = color(score)/2 + 128
					return `rgb(${r}, ${g}, 255)`
				})
				.style("stroke", "black")

	sel.exit()
		.remove()

}







