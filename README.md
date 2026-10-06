# Abhay Narayan Dwivedi

[![IEEE ICC 2025](https://img.shields.io/badge/IEEE%20ICC%202025-Published-2ea44f?style=flat-square)](#)
[![xTerra Robotics](https://img.shields.io/badge/xTerra%20Robotics-Ex%20Intern-e11d48?style=flat-square)](#)
[![IIT Mandi](https://img.shields.io/badge/IIT%20Mandi-Research%20Intern-0ea5e9?style=flat-square)](#)

[GitHub](#) | [LinkedIn](#) | [Portfolio](#) | abhaydwivedi10122005@gmail.com | +919569474160

---

## 🎓 Education

**Central University of Karnataka, India** (2023 – 2027)  
Bachelor of Technology in Mathematics and Computing  
CGPA: 7.65

## 💻 Skills

- **Languages:** Python, SQL, JavaScript, C++, R
- **Libraries:** NumPy, Pandas, OpenCV, Scikit-learn, Mediapipe, Seaborn, Pillow, ONNX, torchvision
- **Frameworks:** TensorFlow, PyTorch, Keras
- **Tools & Simulators:** Git, Power BI, TensorBoard, PyBullet, MuJoCo
- **AI & ML:** Supervised & Unsupervised Learning, Feature Engineering, CNNs, LSTMs, Computer Vision, Reinforcement Learning (RL)

## 💼 Experience

### xTerra Robotics (Intern) 
*May 2026 – July 2026*
- Implemented **PD and model-based controllers** in MuJoCo for CartPole, Furuta pendulum, and reaction wheel pendulum; deployed PD control on Furuta pendulum that **balanced upright for 10+ seconds** under real-world noise.
- Designed a reward function and trained a **PPO agent for a bipedal robot** in MuJoCo to learn **sit-to-stand motion** from an **IK-generated reference trajectory**.
- Developed **inverse kinematics pipeline** for a biped robot covering **deep squat-to-stand, sit-to-stand, and fallen-to-stand** transitions with smooth joint trajectory continuity.
- Engineered a **PD controller for dynamic deep squat-to-stand** execution on a bipedal robot in MuJoCo simulation.

### IIT Mandi (Intern) 
*May 2025 – Dec 2025*
- Engineered **3+ RL based biped locomotion systems** in custom **Gymnasium** environments using **PyBullet** simulation.
- Designed and benchmarked a **6–8 DOF underactuated biped** using **SAC, TD3, and DDPG over 10M+ training steps**, achieving **2% fall rate and 94% navigation success** under stochastic disturbances.
- Integrated **A* global path planning** with a **SAC-trained locomotion controller** to enable **hierarchical obstacle avoidance**, achieving **87.6% goal success** in cluttered environments.
- Formulated progressive **waypoint-based reward shaping** to enhance navigation stability and **goal-directed learning**.

### YBI Foundation (Intern) 
*Oct 2024 – Dec 2024*
- Executed **3+ end-to-end data analytics projects** involving EDA, feature engineering, and predictive modeling.
- Improved model accuracy from baseline levels to **75-85%** through structured preprocessing and algorithm optimization.
- Built **predictive pipelines** using Python, Pandas, and Scikit-learn; **visualized business insights** with **Matplotlib and Seaborn**.

## 🚀 Projects

### LLM-Guided Reward Shaping for Bipedal Locomotion
*Tech Stack: Python | Gemini 2.5 Flash | Gymnasium | PyBullet | SAC | NumPy | Matplotlib*
- Built an **automated pipeline** using **Gemini 2.5 Flash** to iteratively **generate and refine RL reward functions** for a SAC-trained biped, enabling **robust locomotion** across 4 procedurally generated terrain types: flat, uneven, slopes, and stairs.
- **Achieved full 151+ unit course completion** (vs. −0.76 units for vanilla PPO baseline) with a **gait symmetry index of 0.023** and **torso tilt of 0.086 rad**.
- Evaluated **21 gait-specific metrics** and integrated a **human hint file** to enforce naturalistic locomotion: alternating leg swing, 15cm step size, and increased walking speed.
- Engineered a **continuous training pipeline** with automated resume, trend-aware **LLM prompting**, and automatic rollback on generated code failure.

### Unitree G1: Whole-Body Control for Balancing & Sit-to-Stand
*Tech Stack: Python | MuJoCo | NumPy | OSQP | Whole-Body Control*
- Developed a **500 Hz QP-based Whole-Body Controller (WBC)** for the Unitree G1 humanoid, optimizing joint accelerations, torques, and contact forces under physical constraints.
- Formulated **rigid-body dynamics and task-space objectives** for CoM and posture tracking, incorporating foot-contact, torque-limit, friction-cone, and joint-acceleration constraints.
- Implemented **sit-to-stand control** using a 4.5 s kinematic trajectory followed by WBC-based stabilization, achieving a **smooth transition** to the final standing posture.

## 📄 Publications

- **Learning Multi-Skill Locomotion in Underactuated Biped: A Waypoint-Based Reward Shaping Approach**  
  *Published in IEEE ICC 2025 (International Peer-Reviewed Conference).*
