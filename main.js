#!/usr/bin/env node
let inputArray = process.argv.slice(2);
console.log(inputArray);

const fs = require("fs");
const path = require("path");
//what we will made
// node main.js tree "directoryPath"
//node main.js organize "directoryPath"
//node main.js help

let types = {
    media: ["mp4","mkv"],
    archives:["zip","7z","rar","tar","gz","ar","iso","xz"],
    documents:["docx","doc","pdf","xlsx","xls","odt","ods","odp","odf","odg","txt","ps","tex"],
    app:['exe','dmg','pkg','deb'],
    images:['png','jpeg','jpg'],
    programm:['java']
}

let command = inputArray[0];

switch(command)
{
    case "tree":
        treeFn(inputArray[1]);
        break;
    case "organize":
        organizeFn(inputArray[1]);
        break;
    case "help":
        helpFn();
        break;
    default:
        console.log("Please input right command 🤦‍♂️");
}

function treeFn(directoryPath)
{
    console.log("tree command implemented for ",directoryPath);
    //1. input -> directory path given
    if(directoryPath==undefined)
    {
        // console.log("Kindly enter the path");
        treeHelper(process.cwd(),"-");
        return;
    }
    else
    {
        let doesExist = fs.existsSync(directoryPath);

        if(doesExist)
        {
            //2. create -> organized_files -> directory
            treeHelper(directoryPath,"-");
        }
        else
        {
            console.log("Kindly enter the correct path");
            return;
        }
    }
}

function treeHelper(directoryPath,indent)
{
    //is file or folder
    let isfile = fs.lstatSync(directoryPath).isFile();
    if(isfile==true)
    {
        let filename = path.basename(directoryPath);
        console.log(indent + "|-"+filename);
    }
    else
    {
        let dirname = path.basename(directoryPath);
        console.log(indent + "|_"+dirname);
        let children = fs.readdirSync(directoryPath);
        for(let i=0;i<children.length;i++)
        {
            let childrenpath = path.join(directoryPath,children[i]);
            treeHelper(childrenpath,indent);
        }
    }
}
function organizeFn(directoryPath)
{
    console.log("Organize command implemented for ",directoryPath);
    //1. input -> directory path given
    let organizedpath ;
    if(directoryPath==undefined)
    {
        console.log("Kindly enter the path");
        // organizedpath = path.join(process.cwd(),'organized_files')
        // organizeHelper(process.cwd(),organizedpath);
        return;
    }
    else
    {
        let doesExist = fs.existsSync(directoryPath);

        if(doesExist)
        {
            //2. create -> organized_files -> directory
            organizedpath = path.join(directoryPath,'organized_files');
            if(fs.existsSync(organizedpath) ==false)
            {
                fs.mkdirSync(organizedpath);
            }
        }
        else
        {
            console.log("Kindly enter the correct path");
        }

    }

        //3. identify categories of all the files present in that input directory ->
        organizeHelper(directoryPath,organizedpath);

        //4. copy/cut files to that organized directory inside of any of category folder
}

function organizeHelper(inputPath,destinationPath)
{
    let children = fs.readdirSync(inputPath);
    console.log("this is list of allfiles in input folder "+inputPath);
    console.log(children);
    console.log(children[0]);
    console.log(path.join(inputPath,children[0]));
    console.log(fs.lstatSync(path.join(inputPath,children[0])).isFile());
    console.log(path.extname(path.join(inputPath,children[0])).slice(1));

    for(let i=0;i<children.length;i++)
    {
        let childrenAdress = path.join(inputPath,children[i]);

        let isFile = fs.lstatSync(childrenAdress).isFile();
        if(isFile)
        {
            let category = getCategory(childrenAdress);
            console.log(childrenAdress + " belongs to ---->"+category);
            sendFile(childrenAdress,destinationPath,category);
        }
    }
}

function sendFile(srcfilepath,dest,category)
{
    let categoryPath = path.join(dest,category);
    console.log(categoryPath);
    if(fs.existsSync(categoryPath) == false)
    {
        fs.mkdirSync(categoryPath);
    }

    let filename = path.basename(srcfilepath);
    let destinationPath  = path.join(categoryPath,filename);
    fs.copyFileSync(srcfilepath,destinationPath);
    // fs.unlinkSync(srcfilepath);
    console.log(filename + "copied to "+category);
}

function getCategory(address)
{
    let ext = path.extname(address);
    ext = ext.slice(1);
    for(let type in types)
    {
        let cTypeArray = types[type];
        for(let i=0;i<cTypeArray.length;i++)
        {
            if(ext == cTypeArray[i])
            {
                return type;
            }
        }
    }
    return "others";
}
function helpFn()
{
    console.log(`List of all command:
                    node main.js tree "directoryPath"
                    node main.js tree "directoryPath"
                    node main.js help
                    `);
}
