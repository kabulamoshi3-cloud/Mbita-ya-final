import fetch from 'node-fetch';

const testData = {
  fullName: "Dr. Test Name",
  title: "Test Title",
  department: "Test Dept",
  institution: "Test Uni",
  email: "test@test.com",
  officeLocation: "Office 1",
  officeHours: "9-5",
  bio: "Test bio"
};

console.log('\n🧪 Testing Profile API...\n');
console.log('Sending data:', JSON.stringify(testData, null, 2));

fetch('http://localhost:3000/api/admin/profile', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(testData)
})
.then(res => res.json())
.then(data => {
  console.log('\n✅ Response:', JSON.stringify(data, null, 2));
})
.catch(err => {
  console.error('\n❌ Error:', err.message);
});
