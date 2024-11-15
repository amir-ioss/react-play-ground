import React, { useEffect, useState } from 'react'
import FilePicker from './comps/FilePicker'
import { NFTStorage, File } from 'nft.storage'
const client = new NFTStorage({
  token:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDZERUVhZDM5RGM2ZTU0ZDY3YWZjMzkxNjJjMjI2RTA2NTJGNjQ5RmYiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY2MjU1MDI2NDc3MCwibmFtZSI6Im5mdE1hcmtldFBsYWNlIn0.QlJI0zJXwoSBxcpyg80KdtGH1kimlja4YXjZCl06D4E',
})

export default function Test() {
  const [file, setFile] = useState('')

  useEffect(() => {
    var str =
      'ipfs://bafyreidkegz2thena4dzhuomkv3dqmqlncz7aubwnsgemsrvg5ref7prhy/metadata.json'
    var strs = str.split('/')
    console.log(strs[2])
    // fetch("ipfs://bafyreidkegz2thena4dzhuomkv3dqmqlncz7aubwnsgemsrvg5ref7prhy/metadata.json")
    fetch(`https://${strs[2]}.ipfs.dweb.link/metadata.json`)
      .then((response) => response.json())
      .then((data) => console.log('----------', data.image))
  }, [])

  return (
    <div>
      <FilePicker value={file} handleFile={(e) => setFile(e)} />
      {file && <button onClick={() => main(file)}>Upload</button>}
    </div>
  )
}

async function main(file_) {
  const metadata = await client.store({
    name: 'test f',
    description: 'TEST Pin is not delicious beef!',
    image: file_,
    // image: new File(
    //   [
    //     /* data */
    //   ],
    //   'pinpie.jpg',
    //   { type: 'image/jpg' }
    // ),
  })
  console.log(metadata.url)
  var str = metadata.url
  var strs = str.split('/')
  console.log(strs[2])
  // fetch("ipfs://bafyreidkegz2thena4dzhuomkv3dqmqlncz7aubwnsgemsrvg5ref7prhy/metadata.json")
  fetch(`https://${strs[2]}.ipfs.dweb.link/metadata.json`)
    .then((response) => response.json())
    .then((data) => console.log('-----final-----', data))

  // ipfs://bafyreib4pff766vhpbxbhjbqqnsh5emeznvujayjj4z2iu533cprgbz23m/metadata.json
  // https://bafyreib4pff766vhpbxbhjbqqnsh5emeznvujayjj4z2iu533cprgbz23m.ipfs.dweb.link/metadata.json
}
