export default function getWordPos(arr, index, lastIndex, start, end, way) {

  if (0 === arr.length) {
    arr[0] = [index, lastIndex];
    return;
  }

  if (end - start < 0) {
    const wayLeft = 'left' === way;
    const [ leftIndex, rightIndex ] = wayLeft ? [ start -1, start ] : [ end, end + 1 ];
    const leftEl = arr[leftIndex], rightEl = arr[rightIndex];

    if (wayLeft) {
      const [ rightBarrier ] = rightEl;

      if (lastIndex < rightBarrier) {
        if (! leftEl) {
          arr.unshift([ index, lastIndex ]);
          return;
        }

        const [ , leftBarrier ] = leftEl;
        if (index > leftBarrier) {
          arr.splice(rightIndex, 0, [ index, lastIndex ]);
          return;
        }
        return;
      }
      return;
    }

    const [ , leftBarrier ] = leftEl;

    if (index > leftBarrier) {
      if (! rightEl) {
        arr.push([ index, lastIndex ]);
        return;
      }

      const [ rightBarrier ] = rightEl;
      if (lastIndex < rightBarrier) {
        arr.splice(rightIndex, 0, [ index, lastIndex ]);
        return;
      }
      return;
    }
    return;
  }

  const mid = Math.floor((start + end) / 2);

  const [ savedIndex ] = arr[mid];

  if (savedIndex === index) {
    return;
  }

  if (savedIndex > index) {
    return getWordPos(arr, index, lastIndex, 0, mid - 1, 'left');
  }

  return getWordPos(arr, index, lastIndex, mid + 1, end, 'right');
};

