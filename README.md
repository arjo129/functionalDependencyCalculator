# Functional Dependency Calculator

A simple web based tool for exploring functional dependencies. 
Live version is availabe here: 
https://arjo129.github.io/functionalDependencyCalculator/index.html


![example_page_pv](docs/example.png)

# Features

- Calculate Attribute Closure (F+) of FDs via [superkey identification](js/functionaldeps.js#L117)
- Calculate FD Closure via [powerset construction](js/functionaldeps.js#L161)co
- Calculate Minimal Cover via [attribute reduction](js/functionaldeps.js#L556)
- Check Normal Forms (2NF, 3NF, BCNF) via [normal form decomposition](js/functionaldeps.js#L352)

- Display all possible dependencies
- Highlight Candidate Keys, Super Keys, and Trivial Dependencies 


- Cross-platform (Linux, MacOS, BSDs, Windows)
- Extremely lightweight
- Offline calculation

# Non-Features 

- Show calculation steps
- Chase Test
- Show normalized FDs
- Lossless Join Decomposition


# Installation

See [functionalDependencyCalculator](https://arjo129.github.io/functionalDependencyCalculator/index.html) for live version

This method requires [Node js](https://nodejs.org/en/download/)

On Windows & Unix:

```bash
git clone https://github.com/arjo129/functionalDependencyCalculator
cd functionalDependencyCalculator

npm install --global http-server
http-server -d false -p 8080
```

## Usage

After installation, a webserver should open on localhost with the specified port.
Visit [http://localhost:8080](http://localhost:8080) to view the functional server

## Contributing

See [contributing](contribute.md) for guidelines.