import React, { useEffect, useState } from 'react'
import FilePicker from './comps/FilePicker'
import { Web3Storage, getFilesFromPath } from 'web3.storage'
import { create } from 'ipfs-http-client'
// bafybeia2hqb2fzx5rpwjwcqcddwdh6rcaodcz5iij4iuqybby2kra4cr5e
const token =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweEY3MTMxZWI2OWREQzFmNDdCRENGQzlEMkM5ZDQ4ZTI3MjZEMDQxNzMiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NjI3MDIwMzMzNjQsIm5hbWUiOiJuZnRfbWFya2V0cGxhY2UifQ.tQtIj4S5gGOogrl0FIV9GdLpdFnEtWsf6GIVuAcFmCM'
const client = new Web3Storage({ token })

export default function Test() {
  const [file, setFile] = useState('')
  

  useEffect(async () => {
    // console.log(await getFile("bafybeiaj7o3xh2rilrvc57s3hltfaudfg6svnptf4gb7qkuysicqy5n3qe"));
  }, [])

  async function getFile(cid) {
    const res = await client.get(cid)
    const files = await res.files()
    const links = []
    for (const file of files) {
      var link ="https://"+file.cid+".ipfs.w3s.link/?filename="+file.name
      links.push(link)
      // console.log(`${file.cid}: ${file.name} (${file.size} bytes)`)
    }
    // console.log(links)
    return links[0]
  }

  // https://bafkreibiju2bsgwhzbw2bo3j5gseq4nbueaj2wwnyjsokihgxevbjnbseu.ipfs.w3s.link/?filename=nft4.svg

  async function putFile(file_) {
    const fileInput = document.querySelector('input[type="file"]')
    // const files = await getFilesFromPath(fileInput.files)
    console.log(fileInput.files)


    // const cid = await client.put(makeFileObjects(fileInput.files))
    const cid = await client.put(fileInput.files)
    console.log(cid)
    console.log('==data==')
    getFile(cid)
  }

  return (
    <div>
      <FilePicker value={file} handleFile={(e) => setFile(e)} />
      {file && <button onClick={() => putFile(file)}>Upload</button>}
    </div>
  )
}


function makeFileObjects(img) {
  // You can create File objects from a Blob of binary data
  // see: https://developer.mozilla.org/en-US/docs/Web/API/Blob
  // Here we're just storing a JSON object, but you can store images,
  // audio, or whatever you want!
  const obj = { hello: 'world' }
  const blob = new Blob([JSON.stringify(obj)], { type: 'application/json' })

  const files = [
    new File(['contents-of-file-1'], 'plain-utf8.txt'),
    new File([blob], 'hello.json'),
    new File(img, 'test_img.vsg')
  ]
  return files
}






