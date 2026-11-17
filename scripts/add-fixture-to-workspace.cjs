const fs=require('fs');
const file='D:/developing/DSH-plugin/dsh-A2UI/.dsh-test-home/storages/workspace.json';
const raw=fs.readFileSync(file,'utf8'); const data=JSON.parse(raw);
const ws=data.tables.workspaces['0b7c1e2a-1111-4c3d-9abc-5de6f7081920'];
const id=process.argv[2] ?? 'session-86174a28-2731-428b-8b1f-df1b264805f8';
if(!ws.sessionIds.includes(id)) ws.sessionIds.push(id);
ws.updatedAt=new Date().toISOString();
fs.writeFileSync(file, JSON.stringify(data,null,2));
console.log(ws.sessionIds);