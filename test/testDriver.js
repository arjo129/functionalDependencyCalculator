var fdlib = require("../js/calculate-lib");

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
       });
    });
    describe('#isThirdNF', function () {
       it('Correctly classifies relation as 3NF but not BCNF', function () {
           var fd1 = new fdlib.FunctionalDependency(["a"], ["b","c","d"]);
           var fd2 = new fdlib.FunctionalDependency(["b","c"], ["a","d"]);
           var fd3 = new fdlib.FunctionalDependency(["d"], ["b"]);
           var relationalSchema = new fdlib.RelationalSchema([fd1,fd2,fd3]);
           assert.equal(relationalSchema.isSecondNF(), true);
           assert.equal(relationalSchema.isThirdNF(), true);
           assert.equal(relationalSchema.isBCNF(), false);
       });
    });

    describe('#isSecondNF', function () {
        it('Correctly classifies relation as not 2nf', function () {
            var fd1 = new fdlib.FunctionalDependency(["a", "d"], ["b","c"]);
            var fd2 = new fdlib.FunctionalDependency(["d"], ["b"]);
            var relationalSchema = new fdlib.RelationalSchema([fd1,fd2]);
            assert.equal(relationalSchema.isSecondNF(), false);
        });
        it('Correctly classifies relation as 2nf', function () {
            var fd1 = new fdlib.FunctionalDependency(["a", "d"], ["b","c"]);
            var relationalSchema = new fdlib.RelationalSchema([fd1]);
            assert.equal(relationalSchema.isSecondNF(), true);
        });
    });

    describe('#equals', function () {
        it('Correctly identifies identical relations', function () {
            var fd1 = new fdlib.FunctionalDependency(["a", "d"], ["b","c"]);
            var fd2 = new fdlib.FunctionalDependency(["b"], ["a"]);
            var relationalSchema = new fdlib.RelationalSchema([fd1,fd2]);

            var fd11 = new fdlib.FunctionalDependency(["a", "d"], ["b","c"]);
            var fd12 = new fdlib.FunctionalDependency(["b"], ["a"]);
            var relationalSchema2 = new fdlib.RelationalSchema([fd12,fd11]);

            assert.equal(relationalSchema.equals(relationalSchema2), true);
        });

        it('Correctly identifies unequal relations', function () {
            var fd1 = new fdlib.FunctionalDependency(["a", "d"], ["b","c"]);
            var fd2 = new fdlib.FunctionalDependency(["b"], ["a"]);
            var relationalSchema = new fdlib.RelationalSchema([fd1,fd2]);

            var fd11 = new fdlib.FunctionalDependency(["a", "d"], ["b","c"]);
            var relationalSchema2 = new fdlib.RelationalSchema([fd11]);

            assert.equal(relationalSchema.equals(relationalSchema2), false);
        });

        it('Correctly identifies relations with same closure but different description', function () {
            var fd1 = new fdlib.FunctionalDependency(["a"], ["b"]);
            var fd2 = new fdlib.FunctionalDependency(["a","b"], ["b"]);
            var relationalSchema = new fdlib.RelationalSchema([fd1,fd2]);

            var fd11 = new fdlib.FunctionalDependency(["a"], ["b"]);
            var relationalSchema2 = new fdlib.RelationalSchema([fd11]);
            assert.equal(relationalSchema.equals(relationalSchema2), true);
        });
    })

});

describe('FunctionalDependency', function () {
   describe('#isTrivial', function () {
       it('An FD of form b->b is trivial correctly', function () {
           var fd1 = new fdlib.FunctionalDependency(["b"], ["b"]);
           assert.equal(fd1.isTrivial(), true);
       });
       it('An FD of form ab->b is trivial correctly', function () {
           var fd1 = new fdlib.FunctionalDependency(["a","b"], ["b"]);
           assert.equal(fd1.isTrivial(), true);
       });
       it('An FD of form a->b is not trivial correctly', function () {
           var fd1 = new fdlib.FunctionalDependency(["a"], ["b"]);
           assert.equal(fd1.isTrivial(), false);
       });
   });

    describe('#decomposeRHS', function () {
        it('An FD of form b->ba is decomposed correctly', function () {
            var fd1 = new fdlib.FunctionalDependency(["b"], ["a","c"]);
            assert.equal(fd1.decomposeRHS().length,2);
        });
    })
});

