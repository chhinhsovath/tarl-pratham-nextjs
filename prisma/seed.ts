import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.quickLoginUser.deleteMany({});
  
  const password = await bcrypt.hash('admin123', 10);
  
  const users = [
    // Admins
    { username: 'kairav', name: 'Kairav Admin', role: 'admin', province: 'All', subject: 'All', school: 'All' },
    { username: 'admin', name: 'System Admin', role: 'admin', province: 'All', subject: 'All', school: 'All' },
    
    // Coordinators
    { username: 'coordinator', name: 'Coordinator One', role: 'coordinator', province: 'All', subject: 'All', school: 'All' },
    
    // Mentors
    { username: 'deab.chhoeun', name: 'Deab Chhoeun', role: 'mentor', province: 'All', subject: 'All', school: 'All' },
    { username: 'heap.sophea', name: 'Heap Sophea', role: 'mentor', province: 'All', subject: 'All', school: 'All' },
    { username: 'leang.chhun.hourth', name: 'Leang Chhun Hourth', role: 'mentor', province: 'All', subject: 'All', school: 'All' },
    { username: 'mentor1', name: 'Mentor One', role: 'mentor', province: 'All', subject: 'All', school: 'All' },
    { username: 'mentor2', name: 'Mentor Two', role: 'mentor', province: 'All', subject: 'All', school: 'All' },
    { username: 'chhorn.sopheak', name: 'Chhorn Sopheak', role: 'mentor', province: 'All', subject: 'All', school: 'All' },
    { username: 'em.rithy', name: 'Em Rithy', role: 'mentor', province: 'All', subject: 'All', school: 'All' },
    { username: 'nhim.sokha', name: 'Nhim Sokha', role: 'mentor', province: 'All', subject: 'All', school: 'All' },
    { username: 'noa.cham.roeun', name: 'Noa Cham Roeun', role: 'mentor', province: 'All', subject: 'All', school: 'All' },
    { username: 'rorn.sareang', name: 'Rorn Sareang', role: 'mentor', province: 'All', subject: 'All', school: 'All' },
    { username: 'sorn.sophaneth', name: 'Sorn Sophaneth', role: 'mentor', province: 'All', subject: 'All', school: 'All' },
    { username: 'eam.vichhak.rith', name: 'Eam Vichhak Rith', role: 'mentor', province: 'All', subject: 'All', school: 'All' },
    { username: 'el.kunthea', name: 'El Kunthea', role: 'mentor', province: 'All', subject: 'All', school: 'All' },
    { username: 'san.aun', name: 'SAN AUN', role: 'mentor', province: 'All', subject: 'All', school: 'All' },
    { username: 'chhoeng.marady', name: 'Ms. Chhoeng Marady', role: 'mentor', province: 'All', subject: 'All', school: 'All' },
    { username: 'horn.socheata', name: 'Ms. Horn Socheata', role: 'mentor', province: 'All', subject: 'All', school: 'All' },
    { username: 'phann.savoeun', name: 'Ms. Phann Savoeun', role: 'mentor', province: 'All', subject: 'All', school: 'All' },
    { username: 'sin.borndoul', name: 'Sin Borndoul', role: 'mentor', province: 'All', subject: 'All', school: 'All' },
    
    // Teachers - Battambang
    { username: 'chann.leakeana.bat', name: 'Chann Leakeana', role: 'teacher', province: 'Battambang', subject: 'Khmer', school: 'Meas Pitou Kg38' },
    { username: 'ho.mealtey.bat', name: 'Ho Mealtey', role: 'teacher', province: 'Battambang', subject: 'Khmer', school: 'IN SIDAREI PS' },
    { username: 'hol.phanna.bat', name: 'Hol Phanna', role: 'teacher', province: 'Battambang', subject: 'Maths', school: 'Chi Sang PS' },
    { username: 'ieang.bunthoeurn.bat', name: 'Ieang Bunthoeurn', role: 'teacher', province: 'Battambang', subject: 'Maths', school: 'Ta Krouk PS' },
    { username: 'kan.ray.bat', name: 'Kan Ray', role: 'teacher', province: 'Battambang', subject: 'Maths', school: 'Ta Krouk PS' },
    { username: 'keo.socheat.bat', name: 'Keo Socheat', role: 'teacher', province: 'Battambang', subject: 'Maths', school: 'Prey Ampe PS' },
    { username: 'keo.vesith.bat', name: 'Keo Vesith', role: 'teacher', province: 'Battambang', subject: 'Maths', school: 'SINTO PS' },
    { username: 'khim.kosal.bat', name: 'Khim Kosal', role: 'teacher', province: 'Battambang', subject: 'Khmer', school: 'Beung Ampil PS' },
    { username: 'koe.kimsou.bat', name: 'Koe Kimsou', role: 'teacher', province: 'Battambang', subject: 'Khmer', school: 'Anouk Wat PS' },
    { username: 'kheav.sreyoun.bat', name: 'Ms. Kheav Sreyoun', role: 'teacher', province: 'Battambang', subject: 'Khmer', school: 'Badak PS' },
    { username: 'ret.sreynak.bat', name: 'Ms. Ret Sreynak', role: 'teacher', province: 'Battambang', subject: 'Maths', school: 'ROKAR PHING PS' },
    { username: 'nann.phary.bat', name: 'Nann Phary', role: 'teacher', province: 'Battambang', subject: 'Khmer', school: 'Treng PS' },
    { username: 'ny.cheanichniron.bat', name: 'Ny Cheanichniron', role: 'teacher', province: 'Battambang', subject: 'Khmer', school: 'IN SIDAREI PS' },
    { username: 'oeun.kosal.bat', name: 'Oeun Kosal', role: 'teacher', province: 'Battambang', subject: 'Maths', school: 'Prey Ampe PS' },
    { username: 'on.phors.bat', name: 'On Phors', role: 'teacher', province: 'Battambang', subject: 'Khmer', school: 'Raksmey Sangha PS' },
    { username: 'ou.sreynuch.bat', name: 'Ou Sreynuch', role: 'teacher', province: 'Battambang', subject: 'Khmer', school: 'Treng PS' },
    { username: 'pat.sokheng.bat', name: 'Pat Sokheng', role: 'teacher', province: 'Battambang', subject: 'Maths', school: 'Beung Khtom PS' },
    { username: 'pech.peakleka.bat', name: 'Pech Peakleka', role: 'teacher', province: 'Battambang', subject: 'Maths', school: 'ROKAR PHING PS' },
    { username: 'raeun.sovathary.bat', name: 'Raeun Sovathary', role: 'teacher', province: 'Battambang', subject: 'Maths', school: 'Plov Meas PS' },
    { username: 'rin.vannra.bat', name: 'Rin Vannra', role: 'teacher', province: 'Battambang', subject: 'Khmer', school: 'Pech Chang Va PS' },
    { username: 'rom.ratanak.bat', name: 'Rom Ratanak', role: 'teacher', province: 'Battambang', subject: 'Maths', school: 'Pcheav PS' },
    { username: 'sak.samnang.bat', name: 'Sak Samnang', role: 'teacher', province: 'Battambang', subject: 'Khmer', school: 'Raksmey Sangha PS' },
    { username: 'sang.sangha.bat', name: 'Sang Sangha', role: 'teacher', province: 'Battambang', subject: 'Maths', school: 'Beung Khtom PS' },
    { username: 'seum.sovin.bat', name: 'Seum Sovin', role: 'teacher', province: 'Battambang', subject: 'Maths', school: 'Plov Meas PS' },
    { username: 'soeun.danut.bat', name: 'Soeun Danut', role: 'teacher', province: 'Battambang', subject: 'Maths', school: 'Chi Sang PS' },
    { username: 'sokh.chamrong.bat', name: 'Sokh Chamrong', role: 'teacher', province: 'Battambang', subject: 'Khmer', school: 'Meas Pitou Kg38' },
    { username: 'som.phally.bat', name: 'Som Phally', role: 'teacher', province: 'Battambang', subject: 'Khmer', school: 'Beung Ampil PS' },
    { username: 'sor.kimseak.bat', name: 'Sor Kimseak', role: 'teacher', province: 'Battambang', subject: 'Khmer', school: 'Pech Chang Va PS' },
    { username: 'soth.thida.bat', name: 'Soth Thida', role: 'teacher', province: 'Battambang', subject: 'Maths', school: 'SINTO PS' },
    { username: 'tep.sokly.bat', name: 'Tep Sokly', role: 'teacher', province: 'Battambang', subject: 'Khmer', school: 'Badak PS' },
    { username: 'thiem.thida.bat', name: 'Thiem Thida', role: 'teacher', province: 'Battambang', subject: 'Maths', school: 'Pcheav PS' },
    { username: 'thy.sophat.bat', name: 'Thy Sophat', role: 'teacher', province: 'Battambang', subject: 'Maths', school: 'Anouk Wat PS' },
    
    // Teachers - Kampong Cham
    { username: 'chea.putthyda.kam', name: 'Chea Putthyda', role: 'teacher', province: 'Kampong Cham', subject: 'Maths', school: 'Veal Vong PS' },
    { username: 'moy.sodara.kam', name: 'Moy Sodara', role: 'teacher', province: 'Kampong Cham', subject: 'Khmer', school: 'Veal Vong PS' },
    { username: 'chhom.borin.kam', name: 'CHHOM BORIN', role: 'teacher', province: 'Kampong Cham', subject: 'Maths', school: 'An Tong Sar PS' },
    { username: 'hoat.vimol.kam', name: 'Hoat Vimol', role: 'teacher', province: 'Kampong Cham', subject: 'Maths', school: 'Sakha 1 PS' },
    { username: 'khoem.sithuon.kam', name: 'Khoem Sithuon', role: 'teacher', province: 'Kampong Cham', subject: 'Maths', school: 'Sakha 1 PS' },
    { username: 'neang.spheap.kam', name: 'Neang Spheap', role: 'teacher', province: 'Kampong Cham', subject: 'Khmer', school: 'Sdav Leur PS' },
    { username: 'nov.barang.kam', name: 'Nov Barang', role: 'teacher', province: 'Kampong Cham', subject: 'Maths', school: 'Reay Pai PS' },
    { username: 'onn.thalin.kam', name: 'ONN THALIN', role: 'teacher', province: 'Kampong Cham', subject: 'Maths', school: 'Toul Vihea PS' },
    { username: 'pheap.sreynith.kam', name: 'Pheap sreynith', role: 'teacher', province: 'Kampong Cham', subject: 'Maths', school: 'Ou Svay PS' },
    { username: 'phoeurn.virath.kam', name: 'Phoeurn Virath', role: 'teacher', province: 'Kampong Cham', subject: 'Khmer', school: 'Toul Bey PS' },
    { username: 'phuong.pheap.kam', name: 'Phuong Pheap', role: 'teacher', province: 'Kampong Cham', subject: 'Khmer', school: 'Ro KA-A PS' },
    { username: 'say.kamsath.kam', name: 'Say Kamsath', role: 'teacher', province: 'Kampong Cham', subject: 'Khmer', school: 'Sdav PS' },
    { username: 'sorm.vannak.kam', name: 'SORM VANNAK', role: 'teacher', province: 'Kampong Cham', subject: 'Khmer', school: 'Prek Tra Lork PS' },
    { username: 'sum.chek.kam', name: 'Sum Chek', role: 'teacher', province: 'Kampong Cham', subject: 'Khmer', school: 'Kchav PS' },
    { username: 'teour.phanna.kam', name: 'Teour phanna', role: 'teacher', province: 'Kampong Cham', subject: 'Khmer', school: 'Wat Chas PS' },
    { username: 'chan.kimsrorn.kam', name: 'Ms. Chan Kimsrorn', role: 'teacher', province: 'Kampong Cham', subject: 'Khmer', school: 'Ro KA-A PS' },
    { username: 'chhorn.srey.pov.kam', name: 'Ms. Chhorn Srey Pov', role: 'teacher', province: 'Kampong Cham', subject: 'Maths', school: 'Prek Koy PS' },
    { username: 'heak.tom.kam', name: 'Ms. HEAK TOM', role: 'teacher', province: 'Kampong Cham', subject: 'Maths', school: 'An Tong Sar PS' },
    { username: 'heng.chhengky.kam', name: 'Ms. HENG CHHENGKY', role: 'teacher', province: 'Kampong Cham', subject: 'Maths', school: 'Toul Vihea PS' },
    { username: 'heng.navy.kam', name: 'Ms. Heng Navy', role: 'teacher', province: 'Kampong Cham', subject: 'Maths', school: 'Prek Koy PS' },
    { username: 'heng.neang.kam', name: 'Ms. HENG NEANG', role: 'teacher', province: 'Kampong Cham', subject: 'Maths', school: 'Sakha 2 PS' },
    { username: 'him.sokhaleap.kam', name: 'Ms. HIM SOKHALEAP', role: 'teacher', province: 'Kampong Cham', subject: 'Maths', school: 'Sakha 2 PS' },
    { username: 'mach.serynak.kam', name: 'Ms. Mach Serynak', role: 'teacher', province: 'Kampong Cham', subject: 'Khmer', school: 'Kchav PS' },
    { username: 'my.savy.kam', name: 'Ms. My Savy', role: 'teacher', province: 'Kampong Cham', subject: 'Khmer', school: 'Toul Bey PS' },
    { username: 'nov.pelim.kam', name: 'Ms. Nov Pelim', role: 'teacher', province: 'Kampong Cham', subject: 'Khmer', school: 'Sdav Leur PS' },
    { username: 'oll.phaleap.kam', name: 'Ms. Oll Phaleap', role: 'teacher', province: 'Kampong Cham', subject: 'Maths', school: 'Reay Pai PS' },
    { username: 'phann.srey.roth.kam', name: 'Ms. Phann Srey Roth', role: 'teacher', province: 'Kampong Cham', subject: 'Khmer', school: 'Svay Sranors PS' },
    { username: 'phornd.sokthy.kam', name: 'Ms. Phornd sokThy', role: 'teacher', province: 'Kampong Cham', subject: 'Khmer', school: 'Wat Chas PS' },
    { username: 'seiha.ratana.kam', name: 'Ms. SEIHA RATANA', role: 'teacher', province: 'Kampong Cham', subject: 'Maths', school: 'Ou Svay PS' },
    { username: 'seun.sophary.kam', name: 'Ms. Seun Sophary', role: 'teacher', province: 'Kampong Cham', subject: 'Khmer', school: 'Sdav PS' },
    { username: 'thin.dalin.kam', name: 'Ms. THIN DALIN', role: 'teacher', province: 'Kampong Cham', subject: 'Khmer', school: 'Prek Tra Lork PS' },
    { username: 'nheb.channin.kam', name: 'Nheb Channin', role: 'teacher', province: 'Kampong Cham', subject: 'Khmer', school: 'Svay Sranors PS' },
    
    // Viewer
    { username: 'viewer', name: 'Viewer User', role: 'viewer', province: 'All', subject: 'All', school: 'All' },
  ];

  console.log('Seeding quick login users...');
  
  for (const user of users) {
    await prisma.quickLoginUser.create({
      data: {
        username: user.username,
        password: password,
        role: user.role,
        province: user.province === 'All' ? null : user.province,
        subject: user.subject === 'All' ? null : user.subject,
        is_active: true,
      },
    });
    console.log(`Created user: ${user.name} (${user.role})`);
  }

  console.log(`Seeded ${users.length} quick login users successfully!`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });