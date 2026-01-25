import React, { useState, useEffect } from 'react';

const AddSkillModal = ({ isOpen, onClose, onSubmit, type }) => {
  const [category, setCategory] = useState('');
  const [skillName, setSkillName] = useState('');
  const [proficiency, setProficiency] = useState('beginner');
  const [experience, setExperience] = useState(0);
  const [description, setDescription] = useState('');
  const [exchangeSkills, setExchangeSkills] = useState('');

  useEffect(() => {
    if (!isOpen) {
      // reset all fields when modal closes
      setCategory('');
      setSkillName('');
      setProficiency('beginner');
      setExperience(0);
      setDescription('');
      setExchangeSkills('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    // ✅ Prepare payload
    const payload = {
      type, // "Offer" or "Learn"
      category,
      skillName,
      level: proficiency,
      experience,
      description,
      exchangeSkills
    };
    onSubmit(payload); // call parent function
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 font-['Lexend']">
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-md" 
        onClick={onClose}
      ></div>

      <div className="
        bg-[#112217]/95 backdrop-blur-xl border border-[#13ec5b4d] 
        w-full h-full sm:h-auto sm:max-w-2xl 
        sm:rounded-3xl p-6 md:p-10 
        relative overflow-y-auto max-h-screen sm:max-h-[90vh]
        shadow-[0_0_40px_rgba(19,236,91,0.15)]
        flex flex-col
      ">
        <div className="mb-6 md:mb-8 flex justify-between items-start sticky top-0 bg-transparent z-10">
          <div>
            <h3 className="text-xl md:text-2xl font-bold text-white mb-1 md:mb-2">
              {type === 'Offer' ? 'Share your expertise' : 'Skill you want to learn'}
            </h3>
            <p className="text-[#92c9a4] text-xs md:text-sm">
              Fill in the details below to list your skill.
            </p>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 -mr-2 text-slate-400 hover:text-white transition-colors cursor-pointer rounded-full hover:bg-white/10"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form className="space-y-5 md:space-y-6 flex-1" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
            <div className="space-y-2">
              <label className="text-xs md:text-sm font-medium text-[#92c9a4] block ml-1">Skill Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-[#0d1b12] border border-[#23482f] text-white rounded-xl px-4 py-3 focus:ring-1 focus:ring-[#13ec5b] focus:border-[#13ec5b] appearance-none cursor-pointer outline-none transition-all"
              >
                <option value="">Select a category</option>
                <option>Design & Creative</option>
                <option>Development & IT</option>
                <option>Business & Marketing</option>
                <option>Languages</option>
                <option>Music & Arts</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs md:text-sm font-medium text-[#92c9a4] block ml-1">Skill Name</label>
              <input 
                type="text"
                value={skillName}
                onChange={(e) => setSkillName(e.target.value)}
                placeholder="e.g. Figma Prototyping" 
                className="w-full bg-[#0d1b12] border border-[#23482f] text-white rounded-xl px-4 py-3 focus:ring-1 focus:ring-[#13ec5b] focus:border-[#13ec5b] outline-none transition-all" 
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-xs md:text-sm font-medium text-[#92c9a4] block ml-1">Proficiency Level</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {['Beginner', 'Intermediate', 'Advanced'].map((level) => (
                <label key={level} className="relative cursor-pointer group">
                  <input 
                    className="peer sr-only" 
                    type="radio" 
                    name="proficiency" 
                    value={level.toLowerCase()}
                    checked={proficiency === level.toLowerCase()}
                    onChange={() => setProficiency(level.toLowerCase())}
                  />
                  <div className="py-2.5 md:py-3 text-center border border-[#23482f] rounded-xl text-xs md:text-sm font-medium text-slate-400 peer-checked:bg-[#13ec5b22] peer-checked:border-[#13ec5b] peer-checked:text-[#13ec5b] hover:border-[#13ec5b88] transition-all">
                    {level}
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs md:text-sm font-medium text-[#92c9a4] block ml-1">Years of Experience</label>
            <input 
              type="number"
              min="0"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              placeholder="0" 
              className="w-full bg-[#0d1b12] border border-[#23482f] text-white rounded-xl px-4 py-3 focus:ring-1 focus:ring-[#13ec5b] focus:border-[#13ec5b] outline-none transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs md:text-sm font-medium text-[#92c9a4] block ml-1">Description</label>
            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="3"
              placeholder="Briefly describe what you can teach..." 
              className="w-full bg-[#0d1b12] border border-[#23482f] text-white rounded-xl px-4 py-3 focus:ring-1 focus:ring-[#13ec5b] focus:border-[#13ec5b] placeholder:text-slate-600 resize-none outline-none transition-all"
            ></textarea>
          </div>

          <div className="space-y-2">
            <label className="text-xs md:text-sm font-medium text-[#92c9a4] block ml-1">Skills to Exchange</label>
            <input 
              value={exchangeSkills}
              onChange={(e) => setExchangeSkills(e.target.value)}
              placeholder="e.g. Python, Piano..." 
              className="w-full bg-[#0d1b12] border border-[#23482f] text-white rounded-xl px-4 py-3 focus:ring-1 focus:ring-[#13ec5b] focus:border-[#13ec5b] placeholder:text-slate-600 outline-none transition-all"
            />
          </div>

          <div className="pt-4 pb-2">
            <button 
              type="submit"
              className="w-full py-3.5 md:py-4 bg-gradient-to-r from-[#13ec5b] to-[#0fbd48] text-[#102216] font-bold text-base md:text-lg rounded-2xl shadow-lg shadow-[#13ec5b33] hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-xl">rocket_launch</span>
              Publish Skill
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSkillModal;
