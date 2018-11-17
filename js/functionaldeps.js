/**
 * This class is the container for Functional Dependencies.
 * @param lhs left hand side of the functional dependencies, should be an array of strings
 * @param rhs right hand side of the functional dependencies, should be an array of strings
 * @constructor
 */
function FunctionalDependency(lhs, rhs){
    lhs.sort();
    rhs.sort();
    this.lhs = lhs;
    this.rhs = rhs;

    /**
     * Checks if the parameters of the other functional dependency is the same as the one on the LHS
     * @param other
     * @returns {boolean}
     */
    this.equals = function(other) {
        if(!Array.isArray(other.lhs) || !Array.isArray(this.lhs))
            return false;

        if(!Array.isArray(other.rhs) || !Array.isArray(this.rhs))
            return false;

        if(other.lhs.length !== this.lhs.length)
            return false;

        for(var i = 0; i < this.lhs.length; i++){
            if(other.lhs[i] !== this.lhs[i]) return false;
        }

        if(other.rhs.length !== this.rhs.length)
            return false;

        for(var i = 0; i < this.rhs.length; i++){
            if(other.rhs[i] !== this.rhs[i]) return false;
        }
    };

    this.toString = function () {
        str = "{";
        for(var i = 0 ; i  < this.lhs.length; i++){
            str += this.lhs[i];
            if(i+1 !== this.lhs.length)
                str += ", ";
        }
        str += "}->{";
        for(var i = 0 ; i  < this.rhs.length; i++){
            str += this.rhs[i];
            if(i+1 !== this.rhs.length)
                str += ", ";
        }
        str += "}";
        return str;
    };
}

/**
 * Represents a Relational Schema
 * @param fdList - list of functional dependencies.
 * @constructor
 */
function RelationalSchema(fdList){
    this.functionalDependencies = fdList;

    /**
     * This returns the attributes within the schema.
     * @returns {Set} of attributes.
     */
    this.extractAttributes = function () {
        var attributeSet = new Set([]);
        for(var i = 0; i < this.functionalDependencies.length; i++){
            for(var j = 0; j < this.functionalDependencies[i].lhs.length; j++){
                attributeSet.add(this.functionalDependencies[i].lhs[j]);
            }
            for(var j = 0; j < this.functionalDependencies[i].rhs.length; j++){
                attributeSet.add(this.functionalDependencies[i].rhs[j]);
            }
        }
        return attributeSet;
    };

    /**
     * This function calculates the attribute closure of a relational schema.
     * @param attributeSet - set of attributes
     */
    this.attributeClosure = function (attributeSet) {
        var closure = attributeSet;
        var prev_length = 0;
        while(closure.size !== prev_length){
            prev_length = closure.size;
            for(var i = 0; i < this.functionalDependencies.length; i++){
                if(isSubset(this.functionalDependencies[i].lhs, closure)){
                    for(var j = 0; j < this.functionalDependencies[i].rhs.length; j++){
                        closure.add(this.functionalDependencies[i].rhs[j])
                    }
                }
            }
        }
        return closure;
    };

    /**
     * Returns all possible attribute closures within the schema
     */
    this.allAttributeClosures = function () {
        var attributes = this.extractAttributes();
        var attrArray = [];
        attributes.forEach( function(attr){
            attrArray.push(attr)
        });
        powSet = powerSet(attrArray);
        var allClosures = [];
        for(var i = 0; i < powSet.length; i++)
            allClosures.push([powSet[i], this.attributeClosure(new Set(powSet[i]))]);
        return allClosures;
    };

}

/**
 * Check if a subset is a subset of another set
 * @param subset - The set you are checking
 * @param superset - The super set
 * @returns {boolean}
 */
function isSubset(subset, superset){
    for(var  i = 0; i < subset.length; i++){
        if(!superset.has(subset[i])){
            return false;
        }
    }
    return true;
}

function powerSet(lst) {
    function fork(i, t) {
        if (i === lst.length) {
            result.push(t);
            return;
        }
        fork(i + 1, t.concat([lst[i]]));
        fork(i + 1, t);
    }
    var result = [];
    fork(0, []);
    return result;
}

var ParserStates = {
    no_input: 1,
    in_lhs: 2,
    in_rhs: 3,
    in_arrow: 4,
    expect_rhs: 5,
    expect_comma: 6,
    expect_arrow: 7
};

/**
 * Function parses all the string attributes
 * @param input - String with functional dependencies
 */
function parseAttributes(input){
    var curr_state = ParserStates.no_input;
    var lhs = [];
    var rhs = [];
    var fds = [];
    var curr_token = "";
    for(i = 0; i < input.length; i++){
        if(curr_state === ParserStates.no_input){
            if(input[i] === "{"){
                curr_state = ParserStates.in_lhs;
            } else if(input[i] !== " "){
                throw "Format Error!! Expected a functional dependency {a,b}->{c} instead found token: "+i;
            }
        }

        else if(curr_state === ParserStates.in_lhs) {
            if(input[i] === ","){
                lhs.push(curr_token);
                curr_token = "";
            } else if(input[i] === "}") {
                if(curr_token === "") {
                    throw "Format error!! Expected something between the comma and brace!"
                }
                lhs.push(curr_token);
                curr_token = "";
                curr_state = ParserStates.expect_arrow;
            } else if(input[i] !== " ") {
                curr_token += input[i];
            }
        }

        else if(curr_state === ParserStates.expect_arrow) {
            if(input[i] === "-"){
                curr_state = ParserStates.in_arrow;
            } else if (input[i] !== " "){
                throw "Format Error!!  An arrow -> instead found token: " + input[i] + i + "IN_ARROW";
            }
        }

        else if(curr_state === ParserStates.in_arrow) {
            if(input[i] !== ">") {
                throw "Format Error!!  An arrow -> instead found token: -" + input[i];
            } else {
                curr_state = ParserStates.expect_rhs;
            }
        }

        else if(curr_state === ParserStates.expect_rhs){
            if(input[i] === "{"){
                curr_state = ParserStates.in_rhs;
            } else if(input[i] !== " "){
                throw "Format Error!! Expected a functional dependency {a,b}->{c} instead found token: " + input[i];
            }

        }

        else if(curr_state === ParserStates.in_rhs) {
            if(input[i] === ","){
                rhs.push(curr_token);
                curr_token = "";
            } else if(input[i] === "}") {
                curr_state = ParserStates.expect_comma;
                if(curr_token === "") {
                    throw "Format error!! Expected something between the comma and brace!"
                }

                rhs.push(curr_token);
                curr_token = "";
                console.log("creating FD " + lhs + "->"+ rhs);
                fds.push(new FunctionalDependency(lhs,rhs));
                lhs = [];
                rhs = [];
            } else if(input[i] !== " ") {
                curr_token += input[i];
            }
        }

        else if(curr_state === ParserStates.expect_comma){
            if(input[i] === ","){
                curr_state = ParserStates.no_input;
            } else if(input[i] !== " "){
                throw "Format Error!! Only spaces and commas should separate FDs instead found " + input[i];
            }
        }
    }

    return fds;
}

/**
 * Renders the attribute closures and marks them as and when they are needed.
 * @param attrs
 * @param numberOfAttributes
 */
function renderAttributeClosures(attrs, numberOfAttributes){
    var candidateLength = -1;
    var htmlString = "<ul>";
    attrs.sort(function (a, b) { return b[0].length - a[0].length });
    attrs.reverse();
    for(var i = 0; i < attrs.length; i++){
        htmlString += "<li>";
        var latexString = "\\{ ";
        for(var j = 0; j < attrs[i][0].length; j++){
            latexString += attrs[i][0][j];
            if(j + 1  !== attrs[i][0].length){
                latexString += ", ";
            }
        }
        latexString += "\\}+ = \\{";

        var rhs = [];
        attrs[i][1].forEach(function (val) {
           rhs.push(val);
        });


        for(j = 0; j < rhs.length; j++){
            latexString += rhs[j];
            if(j + 1  !== rhs.length){
                latexString += ", ";
            }
        }
        latexString += "\\}";

        htmlString += katex.renderToString(latexString, {
            throwOnError: false
        });

        if(rhs.length === numberOfAttributes){
            if(candidateLength === -1 || candidateLength === attrs[i][0].length){
                candidateLength = attrs[i][0].length;
                htmlString += "<span class='btn btn-success'>Candidate Key</span>";
            }
            else {
                htmlString += "<span class='btn btn-outline-success'>Super Key</span>";
            }
        }

        htmlString += "</li>";
    }
    htmlString += "</ul>";
    document.getElementById("attribute_closures").innerHTML = htmlString;
}

window.onload =function (ev) {
    var input = document.getElementById("functional_deps");
    console.log("hi");
    input.addEventListener("change", function (evt) {
        try {
            fds = parseAttributes(input.value);
            console.log("got "+fds.length+" values");
            for (var j = 0; j < fds.length; j++) {
                console.log(fds[j].toString());
            }
            var relationalSchema = new RelationalSchema(fds);
            var attributeClosures = relationalSchema.allAttributeClosures();
            renderAttributeClosures(attributeClosures, relationalSchema.extractAttributes().size);
            console.log(attributeClosures);
            document.getElementById("errorbox").innerHTML = "";
        } catch (e) {
            console.error("Failed to parse input" + e);
            document.getElementById("errorbox").innerHTML = e;
        }
     });
};