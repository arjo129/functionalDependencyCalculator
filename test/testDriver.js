var fdlib = require("../js/functionaldeps");

var assert = require('assert');

describe('RelationalSchema', function() {
    describe('#minimize()', function() {
        it('should be able to minimize the key {a,b,c} given an FD of {a,b}->{c}', function() {
            var fd = new fdlib.FunctionalDependency(["a","b"], ["c"]);
            var relationalSchema = new fdlib.RelationalSchema([fd]);
            var minimized = relationalSchema.minimize(["a","b","c"]);
            minimized.sort();
            assert.equal(minimized.length, 2);
            assert.equal(minimized[0], "a");
            assert.equal(minimized[1], "b");
        });
    });

    describe('#lookUpAttributeClosure()', function() {
        it('returns full RHS of attribute closure', function() {
            var fd = new fdlib.FunctionalDependency(["a","b"], ["c"]);
            var relationalSchema = new fdlib.RelationalSchema([fd]);
            var minimized = relationalSchema.lookUpAttributeClosure(["a","b"]);
            minimized.sort();
            assert.equal(minimized.length, 3);
        });

        it('returns 0 if element is not in attribute clocure', function() {
            var fd = new fdlib.FunctionalDependency(["a","b"], ["c"]);
            var relationalSchema = new fdlib.RelationalSchema([fd]);
            var count = relationalSchema.lookUpAttributeClosure(["d"]);
            assert.equal(count.length, 0);
        });
    });

    describe('#candidateKeys', function () {
       it('check list of potential candidate keys', function () {
           var fd1 = new fdlib.FunctionalDependency(["a"], ["b","c","d"]);
           var fd2 = new fdlib.FunctionalDependency(["b","c"], ["a","d"]);
           var fd3 = new fdlib.FunctionalDependency(["d"], ["b"]);

           var relationalSchema = new fdlib.RelationalSchema([fd1,fd2,fd3]);
           var results = relationalSchema.candidateKeys();
           assert.equal(results.length, 3);
           for(var i = 0; i < results.length; i++){
               var implies = relationalSchema.lookUpAttributeClosure(results[i]);
               assert.equal(implies.length, 4); //Check all are keys
           }
       })
    });
});
