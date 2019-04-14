'use strict';

/**
 * Returns the array of 32 compass points and heading.
 * See details here:
 * https://en.wikipedia.org/wiki/Points_of_the_compass#32_cardinal_points
 *
 * @return {array}
 *
 * Example of return :
 *  [
 *     { abbreviation : 'N',     azimuth : 0.00 ,
 *     { abbreviation : 'NbE',   azimuth : 11.25 },
 *     { abbreviation : 'NNE',   azimuth : 22.50 },
 *       ...
 *     { abbreviation : 'NbW',   azimuth : 348.75 }
 *  ]
 */
function createCompassPoints() {
    var sides = ['N','E','S','W'];
    let ans = []
    let az = 0
    for(let i = 0; i<32;i++){
        let obj = {}
        let name = ''
        let next = ''
        let cur = sides[Math.floor(i/8)]
        name += cur
        if (Math.floor(i/8) == 3){
          next = sides[0]
        }else{ 
          next = sides[Math.floor(i/8) + 1]
        }
        switch (i%8) {
          case 1:
            name += 'b' + next
            break;
          case 2:
            name = cur
            if (Math.floor(i/8) == 1 || Math.floor(i/8) == 3){
                name += next
            }else{
                name += cur
            }
            if (Math.floor(i/8) == 0 || Math.floor(i/8) == 1){
                name += sides[1]
            }else{
                name += sides[3]
            }
            break;
          case 3:
          if (Math.floor(i/8) == 0 || Math.floor(i/8) == 2){
            name = cur +next
        }else{
            name = next + cur
        }
            name += 'b' + cur
            break;
          case 4:
            if (Math.floor(i/8) == 0 || Math.floor(i/8) == 2){
                name = cur +next
            }else{
                name = next + cur
            }
            break;
          case 5:
          if (Math.floor(i/8) == 0 || Math.floor(i/8) == 2){
            name = cur +next
        }else{
            name = next + cur
        }
            name += 'b' + next
            break;
          case 6:
            name = next  
            if (Math.floor(i/8) == 1 || Math.floor(i/8) == 3){
               name += next
             }else{
                 name += cur
             }
            if (Math.floor(i/8) == 0 || Math.floor(i/8) == 1){
                name += sides[1]
            }else{
                name += sides[3]
            }
            break;
          case 7:
            name = next + 'b' + cur
            break;  
        }
        obj['abbreviation'] = name 
        obj['azimuth'] = az 
        ans.push(obj)
        az += 11.25
    } 
    return ans
  }


/**
 * Expand the braces of the specified string.
 * See https://en.wikipedia.org/wiki/Bash_(Unix_shell)#Brace_expansion
 *
 * In the input string, balanced pairs of braces containing comma-separated substrings
 * represent alternations that specify multiple alternatives which are to appear at that position in the output.
 *
 * @param {string} str
 * @return {Iterable.<string>}
 *
 * NOTE: The order of output string does not matter.
 *
 * Example:
 *   '~/{Downloads,Pictures}/*.{jpg,gif,png}'  => '~/Downloads/*.jpg',
 *                                                '~/Downloads/*.gif'
 *                                                '~/Downloads/*.png',
 *                                                '~/Pictures/*.jpg',
 *                                                '~/Pictures/*.gif',
 *                                                '~/Pictures/*.png'
 *
 *   'It{{em,alic}iz,erat}e{d,}, please.'  => 'Itemized, please.',
 *                                            'Itemize, please.',
 *                                            'Italicized, please.',
 *                                            'Italicize, please.',
 *                                            'Iterated, please.',
 *                                            'Iterate, please.'
 *
 *   'thumbnail.{png,jp{e,}g}'  => 'thumbnail.png'
 *                                 'thumbnail.jpeg'
 *                                 'thumbnail.jpg'
 *
 *   'nothing to do' => 'nothing to do'
 */
function* expandBraces(str) {
    let r = ['']
    let idx=[0]
    
    while( idx[0] < str.length ) {
      let k = str[idx[0]]
      
      if(k == '{'){
        r = merge(r, go(str, idx))
      }else{
         for(let i=0;i<r.length;i++) r[i]+=k
         idx[0] ++ 
      }
    }

    function merge(a, b){
        let r = []
        for(let i=0;i<a.length;i++)for(let j=0;j<b.length;j++) r.push(a[i]+b[j])
        return r
      }
      
      function go(str, idx){
        let r = []
        idx[0] += 1
        
        while(str[idx[0]] != '}'){
          let t = ['']
          while(str[idx[0]] != ',' && str[idx[0]] != '}') {
            let k = str[idx[0]]
            if(k == '{') {
              t = merge(t, go(str,idx))
            }
            else{
              t = merge(t, [k])
              idx[0] ++ 
            }
          }
          if(str[idx[0]] == ','){
            idx[0] ++
            if(str[idx[0]] =='}')r= r.concat([''])
          }
          
          r = r.concat(t)
        }
        idx[0] ++
        if(r.length == 0) r = ['']
        return r
      }
    
    yield* r;
}


/**
 * Returns the ZigZag matrix
 *
 * The fundamental idea in the JPEG compression algorithm is to sort coefficient of given image by zigzag path and encode it.
 * In this task you are asked to implement a simple method to create a zigzag square matrix.
 * See details at https://en.wikipedia.org/wiki/JPEG#Entropy_coding
 * and zigzag path here: https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/JPEG_ZigZag.svg/220px-JPEG_ZigZag.svg.png
 *
 * @param {number} n - matrix dimension
 * @return {array}  n x n array of zigzag path
 *
 * @example
 *   1  => [[0]]
 *
 *   2  => [[ 0, 1 ],
 *          [ 2, 3 ]]
 *
 *         [[ 0, 1, 5 ],
 *   3  =>  [ 2, 4, 6 ],
 *          [ 3, 7, 8 ]]
 *
 *         [[ 0, 1, 5, 6 ],
 *   4 =>   [ 2, 4, 7,12 ],
 *          [ 3, 8,11,13 ],
 *          [ 9,10,14,15 ]]
 *
 */
function getZigZagMatrix(n) {
    let mtx = [];
    for (var i = 0; i < n; i++) 
        mtx[i] = [];
  
    var i=1, j=1;
    for (var e = 0; e < n*n; e++) {
        mtx[i-1][j-1] = e;
        if ((i + j) % 2 == 0) {
            // Even stripes
            if (j < n) j ++;
            else       i += 2;
            if (i > 1) i --;
        } else {
            // Odd stripes
            if (i < n) i ++;
            else       j += 2;
            if (j > 1) j --;
        }
    }
    return mtx
}


/**
 * Returns true if specified subset of dominoes can be placed in a row accroding to the game rules.
 * Dominoes details see at: https://en.wikipedia.org/wiki/Dominoes
 *
 * Each domino tile presented as an array [x,y] of tile value.
 * For example, the subset [1, 1], [2, 2], [1, 2] can be arranged in a row (as [1, 1] followed by [1, 2] followed by [2, 2]),
 * while the subset [1, 1], [0, 3], [1, 4] can not be arranged in one row.
 * NOTE that as in usual dominoes playing any pair [i, j] can also be treated as [j, i].
 *
 * @params {array} dominoes
 * @return {bool}
 *
 * @example
 *
 * [[0,1],  [1,1]] => true
 * [[1,1], [2,2], [1,5], [5,6], [6,3]] => false
 * [[1,3], [2,3], [1,4], [2,4], [1,5], [2,5]]  => true
 * [[0,0], [0,1], [1,1], [0,2], [1,2], [2,2], [0,3], [1,3], [2,3], [3,3]] => false
 *
 */
function canDominoesMakeRow(dominoes) {
    let returned_value=false;
    let is_visited=(new Array(dominoes.length)).fill(false);

    function rec(index,value,left){
        if (left===0){
            returned_value=true;
            return;
        }
        is_visited[index]=true;
        for(let i=0;i<dominoes.length;i++){
            if(!is_visited[i]){
                if(dominoes[i].indexOf(value)!==-1){
                    rec(i,dominoes[i][0]===value?dominoes[i][1]:dominoes[i][0],left-1);
                }
            }
        }
        is_visited[index]=false;
    }
    for(let i=0;i<dominoes.length;i++){
        for (let j=0;j<dominoes[i].length;j++){
            rec(i,dominoes[i][j],dominoes.length-1);
            if (returned_value===true){
                return true;
            }
        }      
    }
    return false; 
}

/**
 * Returns the string expression of the specified ordered list of integers.
 *
 * A format for expressing an ordered list of integers is to use a comma separated list of either:
 *   - individual integers
 *   - or a range of integers denoted by the starting integer separated from the end integer in the range by a dash, '-'.
 *     (The range includes all integers in the interval including both endpoints)
 *     The range syntax is to be used only for, and for every range that expands to more than two values.
 *
 * @params {array} nums
 * @return {bool}
 *
 * @example
 *
 * [ 0, 1, 2, 3, 4, 5 ]   => '0-5'
 * [ 1, 4, 5 ]            => '1,4,5'
 * [ 0, 1, 2, 5, 7, 8, 9] => '0-2,5,7-9'
 * [ 1, 2, 4, 5]          => '1,2,4,5'
 */
function extractRanges(nums) {
    let result = [];
    let rg = [];

    for(let i = 0; i < nums.length; i++) {
      if(nums[i] === (nums[i+1] - 1)) {
        rg.push(nums[i]);
        continue;
      } else {
        rg.push(nums[i]);
      } 
      if(rg.length > 2) {
        rg.push(nums[i]);
        result.push(rg[0] + '-' + rg.pop());
        rg = [];
      } else {
        result.push(rg);
        rg = [];
      }
    }
    return result.join(',');
}

module.exports = {
    createCompassPoints : createCompassPoints,
    expandBraces : expandBraces,
    getZigZagMatrix : getZigZagMatrix,
    canDominoesMakeRow : canDominoesMakeRow,
    extractRanges : extractRanges
};
