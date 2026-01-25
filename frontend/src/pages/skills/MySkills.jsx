
import React, { useState, useEffect } from 'react';
import { PlusCircle } from 'lucide-react';
import UserNavbar from '../../components/common/UserNavbar';
import MySkillCard from '../../components/skills/MySkillCard';
import EditSkillModal from '../../components/modals/EditSkillModal';
import AddSkillModal from '../../components/modals/AddSkillModal';
import CurriculumModal from '../../components/modals/CurriculumModal';
import EditCurriculumModal from '../../components/modals/EditCurriculumModal';
import api from '../../api/api';

const MySkills = () => {
  const [offeredSkills, setOfferedSkills] = useState([]);
  const [wantedSkills, setWantedSkills] = useState([]);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isCurriculumOpen, setIsCurriculumOpen] = useState(false);
  const [isEditCurriculumOpen, setIsEditCurriculumOpen] = useState(false);

  const [selectedSkill, setSelectedSkill] = useState(null);
  const [activeSkillTitle, setActiveSkillTitle] = useState("");
  const [skillType, setSkillType] = useState("Offer"); // Offer or Learn

  const token = localStorage.getItem("token");

  // ===== API CALLS =====
  const fetchMySkills = async () => {
    try {
      const res = await api.get("/skills/my", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOfferedSkills(res.data.offered || []);
      setWantedSkills(res.data.learn || []);
    } catch (err) {
      console.error("Fetch skills error:", err);
    }
  };

  const addSkill = async (data) => {
    try {
      // type = "Offer" or "Learn"
      await api.post("/skills", data, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchMySkills();
      setIsAddModalOpen(false); // close modal after success
    } catch (err) {
      console.error("Add skill error:", err);
    }
  };

  const updateSkill = async (id, data) => {
    try {
      await api.put(`/skills/${id}`, data, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchMySkills();
      setIsEditModalOpen(false);
    } catch (err) {
      console.error("Update skill error:", err);
    }
  };

  const deleteSkill = async (id) => {
    try {
      await api.delete(`/skills/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchMySkills();
    } catch (err) {
      console.error("Delete skill error:", err);
    }
  };

  useEffect(() => {
    fetchMySkills();
  }, []);

  const handleEditClick = (skill) => {
    setSelectedSkill(skill);
    setIsEditModalOpen(true);
  };

  const handleViewCurriculum = (title) => {
    setActiveSkillTitle(title);
    setIsCurriculumOpen(true);
  };

  const openAddModal = (type) => {
    setSkillType(type); // "Offer" or "Learn"
    setIsAddModalOpen(true);
  };

  return (
    <div className="flex h-screen overflow-hidden font-['Lexend'] relative">
      <main className="flex-1 flex flex-col overflow-y-auto">
        <UserNavbar userName="Alex" />

        <div className="p-8 max-w-[1200px] mx-auto w-full">
          {/* ===== OFFERED SKILLS ===== */}
          <section className="mb-12">
            <div className="flex justify-between mb-6">
              <h3 className="text-xl font-bold">Skills I Offer</h3>
              <button
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition"
                onClick={() => openAddModal("Offer")}
              >
                <PlusCircle size={20} /> Add New Skill
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {offeredSkills.map(skill => (
                
                <MySkillCard
                  key={skill._id}
                  title={skill.skillName}
                  level={skill.level}
                  experience={skill.experience}
                  description={skill.description}
                  category={skill.category}
                  exchangeSkills={skill.exchangeSkills}
                  status="Active"
                  isOffer
                  onEdit={() => handleEditClick(skill)}
                  onDelete={() => deleteSkill(skill._id)}
                  onViewCurriculum={() => handleViewCurriculum(skill.skillName)}
                />
                
              )
              )}
            </div>
          </section>

          {/* ===== WANTED SKILLS ===== */}
          <section>
            <h3 className="text-xl font-bold mb-6">Skills I Want to Learn</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {wantedSkills.map(skill => (
                <MySkillCard
                  key={skill._id}
                  title={skill.skillName}
                  level={skill.level}
                  
                  status="Learning"
                  isOffer={false}
                  onEdit={() => handleEditClick(skill)}
                  onDelete={() => deleteSkill(skill._id)}
                />
              ))}

              <button
                className="border-2 border-dashed rounded-2xl p-8 text-gray-400 hover:border-green-500 hover:text-green-500 transition"
                onClick={() => openAddModal("Learn")}
              >
                <PlusCircle size={24} />
                <span className="block mt-2 font-bold">Add Wanted Skill</span>
              </button>
            </div>
          </section>
        </div>
      </main>

      {/* ===== MODALS ===== */}
      <AddSkillModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={addSkill}
        type={skillType} // "Offer" or "Learn"
      />

      <EditSkillModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        skillData={selectedSkill}
        onSubmit={updateSkill}
      />

      <CurriculumModal
        isOpen={isCurriculumOpen}
        onClose={() => setIsCurriculumOpen(false)}
        skillTitle={activeSkillTitle}
      />

      <EditCurriculumModal
        isOpen={isEditCurriculumOpen}
        onClose={() => setIsEditCurriculumOpen(false)}
        skillTitle={activeSkillTitle}
      />
    </div>
  );
};

export default MySkills;
