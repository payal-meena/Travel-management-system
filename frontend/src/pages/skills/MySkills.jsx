import React, { useState, useEffect } from 'react';
import { Search, X, CheckCircle2, PlusCircle } from 'lucide-react'; 
import UserNavbar from '../../components/common/UserNavbar'; 
import MySkillCard from '../../components/skills/MySkillCard'; 
import EditSkillModal from '../../components/modals/EditSkillModal'; 
import AddSkillModal from '../../components/modals/AddSkillModal'; 
import CurriculumModal from '../../components/modals/CurriculumModal';
import EditCurriculumModal from '../../components/modals/EditCurriculumModal';
import { skillService } from '../../services/skillService';

const MySkills = () => {
  // --- States ---
  const [activeTab, setActiveTab] = useState('offered'); 
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isCurriculumOpen, setIsCurriculumOpen] = useState(false);
  const [isEditCurriculumOpen, setIsEditCurriculumOpen] = useState(false);
  const [activeSkillTitle, setActiveSkillTitle] = useState("");
  const [isWantedModalOpen, setIsWantedModalOpen] = useState(false); 
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [targetProficiency, setTargetProficiency] = useState('beginner');
  const [skillName, setSkillName] = useState('');
  const [description, setDescription] = useState('');
  const [offeredSkills, setOfferedSkills] = useState([]);
  const [wantedSkills, setWantedSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMySkills();
    fetchMyWantedSkills();
  }, []);

  const fetchMyWantedSkills = async () => {
    try {
      const response = await skillService.getMyWantedSkills();
      if (response.success) {
        const formattedSkills = response.skills.map(skill => ({
          id: skill._id,
          title: skill.skillName,
          level: skill.leval || skill.level,
          icon: "auto_stories",
          detail: "Looking for mentor",
          status: "Searching for partners",
          description: skill.description
        }));
        setWantedSkills(formattedSkills);
      }
    } catch (error) {
      console.error('Error fetching wanted skills:', error);
    }
  };

  const handleAddWantedSkill = async () => {
    if (!skillName.trim()) return;
    try {
      const skillData = {
        skillName: skillName.trim(),
        level: targetProficiency.charAt(0).toUpperCase() + targetProficiency.slice(1),
        description: description.trim()
      };
      await skillService.addWantedSkill(skillData);
      fetchMyWantedSkills();
      setIsWantedModalOpen(false);
      setSkillName('');
      setDescription('');
      setTargetProficiency('beginner');
    } catch (error) {
      console.error('Error adding wanted skill:', error);
    }
  };

  const fetchMySkills = async () => {
    try {
      setLoading(true);
      const response = await skillService.getMySkills();
      if (response.success) {
        const formattedSkills = response.skills.map(skill => ({
          id: skill._id,
          title: skill.skillName,
          level: skill.level,
          icon: getIconForCategory(skill.catogory),
          detail: `${skill.experience} years experience`,
          status: skill.isActive ? "Active" : "Paused",
          description: skill.description,
          category: skill.catogory,
          type: skill.type
        }));
        setOfferedSkills(formattedSkills);
      }
    } catch (error) {
      console.error('Error fetching skills:', error);
    } finally {
      setLoading(false);
    }
  };

  const getIconForCategory = (category) => {
    const iconMap = {
      'Design & Creative': 'brush',
      'Development & IT': 'code',
      'Languages': 'translate',
      'Business & Marketing': 'business',
      'Music & Arts': 'music_note',
      'Education': 'school'
    };
    return iconMap[category] || 'star';
  };

  const handleSkillAdded = () => {
    fetchMySkills();
    setIsAddModalOpen(false);
  };

  const handleDeleteSkill = async (skillId) => {
    try {
      await skillService.deleteSkill(skillId);
      fetchMySkills();
    } catch (error) {
      console.error('Error deleting skill:', error);
    }
  };

  const handleDeleteWantedSkill = async (skillId) => {
    try {
      await skillService.deleteWantedSkill(skillId);
      fetchMyWantedSkills();
    } catch (error) {
      console.error('Error deleting wanted skill:', error);
    }
  };

  const handleEditClick = (skill) => {
    setSelectedSkill(skill);
    setIsEditModalOpen(true);
  };

  const handleViewCurriculum = (title) => {
    setActiveSkillTitle(title);
    setIsCurriculumOpen(true);
  };

  const handleOpenEditCurriculum = () => {
    setIsCurriculumOpen(false); 
    setIsEditCurriculumOpen(true); 
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden font-['Lexend'] relative bg-[rgb(17,34,23)]">
      <UserNavbar userName="Alex" />
      
      <main className={`flex-1 flex flex-col overflow-y-auto transition-all duration-300 ${isWantedModalOpen ? 'blur-sm opacity-50' : ''}`}>
        <div className="max-w-7xl mx-auto w-full px-4 md:px-6 py-6 md:py-10">
          
          {/* --- RESPONSIVE NAVIGATION TABS --- */}
          <div className="flex justify-center mb-10 md:mb-16">
            <div className="relative bg-[#102216] p-1.5 rounded-full md:rounded-[2rem] flex items-center w-full max-w-[340px] md:max-w-lg border border-white/5 shadow-2xl">
              <div 
                className={`absolute h-[calc(100%-12px)] top-[6px] transition-all duration-500 ease-out rounded-full md:rounded-[1.6rem] bg-[#13ec5b] shadow-[0_0_20px_rgba(19,236,91,0.4)]
                ${activeTab === 'offered' ? 'left-[6px] w-[calc(50%-6px)]' : 'left-[50%] w-[calc(50%-6px)]'}`}
              />

              <button 
                onClick={() => setActiveTab('offered')}
                className={`relative z-10 flex-1 flex items-center justify-center gap-2 md:gap-3 py-3 md:py-4 text-[12px] md:text-[15px] font-black uppercase tracking-wider transition-all duration-300 ${activeTab === 'offered' ? 'text-[#0a0f0b]' : 'text-[#92c9a4]/50'}`}
              >
                <span className="material-symbols-outlined text-lg md:text-xl">school</span>
                <span className="hidden xs:inline">Offered</span>
                <span className="xs:hidden"> I Can Teach</span>
              </button>

              <button 
                onClick={() => setActiveTab('wanted')}
                className={`relative z-10 flex-1 flex items-center justify-center gap-2 md:gap-3 py-3 md:py-4 text-[12px] md:text-[15px] font-black uppercase tracking-wider transition-all duration-300 ${activeTab === 'wanted' ? 'text-[#0a0f0b]' : 'text-[#92c9a4]/50'}`}
              >
                <span className="material-symbols-outlined text-lg md:text-xl">auto_stories</span>
                <span className="hidden xs:inline">Wanted</span>
                <span className="xs:hidden"> I Want to Learn</span>
              </button>
            </div>
          </div>

          <div className="w-full">
            {activeTab === 'offered' ? (
              /* --- OFFERED SKILLS SECTION --- */
              <section className="w-full animate-in fade-in slide-in-from-bottom-5 duration-700">
                <div className="flex flex-col md:flex-row items-center justify-between mb-8 md:mb-10 gap-6">
                  <div className="text-center md:text-left">
                    <h3 className="text-white text-2xl md:text-3xl font-black uppercase tracking-tight">Skills I Offer</h3>
                    <div className="h-1 w-12 bg-[#13ec5b] mt-2 mb-2 mx-auto md:mx-0 rounded-full"></div>
                    <p className="text-[#13ec5b] text-[10px] font-black tracking-[0.2em]">SHARE YOUR EXPERTISE</p>
                  </div>
                  <button 
                    onClick={() => setIsAddModalOpen(true)}
                    className="w-full md:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-[#13ec5b] text-[#102216] font-black rounded-2xl hover:shadow-[0_0_25px_rgba(19,236,91,0.4)] transition-all text-[13px] uppercase tracking-widest active:scale-95"
                  >
                    <PlusCircle size={18} />
                    Add New Skill
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                  {loading ? (
                    <div className="col-span-full text-center py-20 flex flex-col items-center">
                      <div className="size-12 border-4 border-[#13ec5b]/20 border-t-[#13ec5b] rounded-full animate-spin mb-4" />
                      <div className="text-[#13ec5b] font-black text-xs tracking-widest uppercase">Syncing...</div>
                    </div>
                  ) : offeredSkills.length > 0 ? (
                    offeredSkills.map((skill) => (
                      <MySkillCard 
                        key={skill.id} 
                        {...skill} 
                        isOffer={true} 
                        onEdit={() => handleEditClick(skill)}
                        onViewCurriculum={() => handleViewCurriculum(skill.title)}
                        onDelete={() => handleDeleteSkill(skill.id)}
                      />
                    ))
                  ) : (
                    <div className="col-span-full text-center py-16 md:py-24 border-2 border-dashed border-[#23482f] rounded-[2rem] md:rounded-[3rem] bg-[#102216]/20 px-6">
                      <div className="text-[#92c9a4]/40 mb-6 font-black uppercase text-xs tracking-[0.3em]">No skills being offered yet</div>
                      <button onClick={() => setIsAddModalOpen(true)} className="text-[#13ec5b] font-black text-xs uppercase underline tracking-widest">Launch Your First Course</button>
                    </div>
                  )}
                </div>
              </section>
            ) : (
              /* --- WANTED SKILLS SECTION --- */
              <section className="w-full animate-in fade-in slide-in-from-bottom-5 duration-700">
                <div className="text-center md:text-left mb-8 md:mb-10">
                  <h3 className="text-white text-2xl md:text-3xl font-black uppercase tracking-tight">Skills I Want</h3>
                  <div className="h-1 w-12 bg-[#13ec5b] mt-2 mb-2 mx-auto md:mx-0 rounded-full"></div>
                  <p className="text-[#13ec5b] text-[10px] font-black tracking-[0.2em]">YOUR GROWTH ROADMAP</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                  {wantedSkills.map((skill, index) => (
                    <MySkillCard 
                      key={skill.id || index} 
                      {...skill} 
                      isOffer={false} 
                      onEdit={() => handleEditClick(skill)}
                      onDelete={() => handleDeleteWantedSkill(skill.id)}
                    />
                  ))}
                  
                  <button 
                    className="border-2 border-dashed border-[#23482f] rounded-[2.5rem] flex flex-col items-center justify-center p-10 md:p-14 text-slate-400 hover:border-[#13ec5b] hover:bg-[#13ec5b]/5 hover:text-[#13ec5b] transition-all group min-h-[250px] md:min-h-[300px]"
                    onClick={() => setIsWantedModalOpen(true)}
                  >
                    <PlusCircle className="mb-5 group-hover:scale-110 transition-transform text-[#13ec5b]/40 group-hover:text-[#13ec5b]" size={48} />
                    <span className="font-black uppercase tracking-[0.2em] text-[10px]">Identify New Target</span>
                  </button>
                </div>
              </section>
            )}
          </div>
        </div>
      </main>

      {/* --- Modals Section --- */}
      <EditSkillModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} skillData={selectedSkill} />
      <AddSkillModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onSkillAdded={handleSkillAdded} />
      <CurriculumModal isOpen={isCurriculumOpen} onClose={() => setIsCurriculumOpen(false)} skillTitle={activeSkillTitle} onEditRequest={handleOpenEditCurriculum} />
      <EditCurriculumModal isOpen={isEditCurriculumOpen} onClose={() => setIsEditCurriculumOpen(false)} skillTitle={activeSkillTitle} />

      {/* Modern Neon Styled Wanted Skill Modal - Responsive */}
      {isWantedModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#050a06]/90 backdrop-blur-sm">
          <div className="bg-[#102216] w-full max-w-lg rounded-[2rem] md:rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/5 animate-in zoom-in-95 duration-300">
            <div className="flex justify-between items-center px-6 md:px-10 py-6 md:py-8 border-b border-white/5">
              <div className="flex items-center gap-3 md:gap-4">
                <PlusCircle className="text-[#13ec5b]" size={20} />
                <h2 className="text-lg md:text-xl font-black text-white uppercase tracking-tight">New Goal</h2>
              </div>
              <button onClick={() => setIsWantedModalOpen(false)} className="text-white/20 hover:text-white transition-colors"><X size={24} /></button>
            </div>

            <div className="p-6 md:p-10 space-y-6 md:space-y-8">
              <div className="space-y-3">
                <label className="block text-[10px] font-black text-[#92c9a4] uppercase tracking-widest">Skill Name</label>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                  <input className="w-full bg-white/5 border border-white/10 focus:border-[#13ec5b] rounded-xl py-4 pl-12 pr-4 text-white outline-none" placeholder="e.g. UI Design" type="text" value={skillName} onChange={(e) => setSkillName(e.target.value)} />
                </div>
              </div>

              <div className="space-y-3">
                <label className="block text-[10px] font-black text-[#92c9a4] uppercase tracking-widest">Proficiency</label>
                <div className="grid grid-cols-3 gap-2 md:gap-4">
                  {['beginner', 'intermediate', 'advanced'].map((level) => (
                    <button key={level} onClick={() => setTargetProficiency(level)} className={`py-3 rounded-xl border text-[9px] font-black uppercase transition-all ${targetProficiency === level ? 'bg-[#13ec5b]/10 border-[#13ec5b] text-[#13ec5b]' : 'bg-white/5 border-white/5 text-white/30'}`}>{level}</button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <label className="block text-[10px] font-black text-[#92c9a4] uppercase tracking-widest">Motivation</label>
                <textarea className="w-full bg-white/5 border border-white/10 focus:border-[#13ec5b] rounded-xl py-4 px-6 text-white outline-none resize-none h-24" placeholder="Why do you want to learn this?" value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
              </div>
            </div>

            <div className="p-6 md:p-10 pt-0 flex flex-col sm:flex-row gap-3">
              <button onClick={() => setIsWantedModalOpen(false)} className="flex-1 px-6 py-4 rounded-xl border border-white/10 text-white/40 font-black text-[10px] uppercase tracking-widest order-2 sm:order-1">Cancel</button>
              <button onClick={handleAddWantedSkill} className="flex-[2] px-6 py-4 rounded-xl bg-[#13ec5b] text-[#102216] font-black text-[10px] uppercase tracking-widest shadow-lg order-1 sm:order-2">Confirm Goal</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MySkills;