import { makeAutoObservable } from 'mobx'

/*


P9	P2	P3
P8	P1	P4
P7	P6	P5

Каждый проход по изображению состоит из двух подитераций.
Подитерация 1:
Пиксель P1 можно удалить если выполняются следующие условия:
1) 2 <= P2+P3+...+P8+P9 <=6
2) S(P1) = 1
3) P2*P4*P6 = 0
4) P4*P6*P8 = 0
где S(P1) - количество найденных последовательностей 01 в последовательности P2, P3, P4, P5, P6, P7, P8, P9, P2. Т.е. для удаления пикселя, вокруг него должен существовать только один переход от нуля к единице.
В данном случае удаляются все пиксели на юго-восточной границе и северо-западные угловые пиксели. Чтобы удалить пиксели на северо-западной границе и юго-восточные угловые пиксели, необходимо выполнить еще одну выше описанную подитерацию заменив пункты 3 и 4 на следующие:
3) P2*P4*P8 = 0
4) P2*P6*P8 = 0

*/

class ZhangStore {
  matrix: number[][] = [
    [0, 0, 1, 0, 1, 1, 1, 0],
    [0, 0, 1, 0, 1, 1, 1, 0],
    [0, 0 ,1, 1, 1, 1, 1, 1],
    [0, 0 ,1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 0, 0],
    [1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 0, 0, 1, 1, 1, 1],
    [1, 1, 0, 0, 1, 1, 0, 0],

        ]

  rowLen = 8

  colLen = 8

  steps: number[][][] = []

  constructor() {
    makeAutoObservable(this)
  }

  onCellClickHandler(row: number, col: number) {
    this.matrix[row][col] = this.matrix[row][col] ? 0 : 1
  }

  private cloneMtr(m: number[][]) {
    return m.map(rs => [...rs])
  }

  computeZhangSuen() {
    const m = this.matrix
    let itrm2_for_rem: number[][] = []
    this.steps.push(this.cloneMtr(m))
    while (itrm2_for_rem) {
      const itrm1_for_rem: number[][] = []
      for (let row = 0; row < m.length; row++) {
        for (let col = 0; col < m[row].length; col++) {
          if (!m[row][col]) continue
          const coords = this.firstIteration(row, col)
          if (coords) itrm1_for_rem.push(coords)
        }
      }
      if (!itrm1_for_rem.length) break

      itrm1_for_rem.forEach(([row, col]) => {
        m[row][col] = 0
      })
      this.steps.push(this.cloneMtr(m))

      itrm2_for_rem = []
      for (let row = 0; row < m.length; row++) {
        for (let col = 0; col < m[row].length; col++) {
          if (!m[row][col]) continue
          const coords = this.secondIteration(row, col)
          if (coords) itrm2_for_rem.push(coords)
        }
      }
      if (!itrm2_for_rem.length) break
      itrm2_for_rem.forEach(([row, col]) => {
        m[row][col] = 0
      })
      this.steps.push(this.cloneMtr(m))
    }
  }

  /*
    P9	P2	P3
    P8	P1	P4
    P7	P6	P5
  */
  private getMaskPIndex(row: number, col: number) {
    const m = this.matrix
    //start p2
    const idx = [
      [row - 1, col],
      [row - 1, col + 1],
      [row, col + 1],
      [row + 1, col + 1],
      [row + 1, col],
      [row + 1, col - 1],
      [row, col - 1],
      [row - 1, col - 1],
    ]
    return idx.map(([i, j]) => [i, j, m[i]?.[j] ? 1 : 0])
  }

  // 0 - p2
  // 2 - p4
  // 4 - p6
  // 6 - p8

  private firstIteration(row: number, col: number) {
    //1 cond 2<= p2...+p9 <=6
    const idxs = this.getMaskPIndex(row, col)
    const vals = idxs.map(e => e[2])
    const sum = vals.reduce((acc, cur) => {
      return cur + acc
    }, 0)
    const isFirstCond = sum >= 2 && sum <= 6

    const secArr = [...vals, vals[0]]
    let sumCond2 = 0
    for (let i = 0; i < secArr.length - 1; i++) {
      if (secArr[i] === 0 && secArr[i + 1] === 1) {
        sumCond2 += 1
      }
    }
    const isSecondCond = sumCond2 === 1

    const isThirdCond = (vals[0] * vals[2] * vals[4]) === 0
    const isFourthCond = (vals[2] * vals[4] * vals[6]) === 0

    if (isFirstCond && isSecondCond && isThirdCond && isFourthCond) {
      return [row, col]
    }

    return null
  }

  private secondIteration(row: number, col: number) {
    //1 cond 2<= p2...+p9 <=6
    const idxs = this.getMaskPIndex(row, col)
    const vals = idxs.map(e => e[2])
    const sum = vals.reduce((acc, cur) => {
      return cur + acc
    }, 0)
    const isFirstCond = sum >= 2 && sum <= 6

    const secArr = [...vals, vals[0]]
    let sumCond2 = 0
    for (let i = 0; i < secArr.length - 1; i++) {
      if (secArr[i] === 0 && secArr[i + 1] === 1) {
        sumCond2 += 1
      }
    }
    const isSecondCond = sumCond2 === 1

    const isThirdCond = (vals[0] * vals[2] * vals[6]) === 0
    const isFourthCond = (vals[0] * vals[4] * vals[6]) === 0

    if (isFirstCond && isSecondCond && isThirdCond && isFourthCond) {
      return [row, col]
    }

    return null
  }
}

const zhangStore = new ZhangStore()

export { zhangStore }
