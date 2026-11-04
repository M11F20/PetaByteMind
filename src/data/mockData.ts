import { PillarNode, VaultSnippet, DossierCaseStudy, NetworkMemberNode } from '@/types';

export const SYSTEM_PILLARS: PillarNode[] = [
  {
    id: 'systems_philosophy',
    index: '01',
    label: 'Systems Philosophy',
    labelAr: 'فلسفة النظم والتعقيد',
    tagline: 'Mechanical sympathy, epistemological limits, and zero-cost mental models',
    taglineAr: 'التعاطف الميكانيكي، حدود المعرفة، والنماذج الفكرية ذات الكلفة الصفرية',
    coordinates: { x: 22, y: 30 },
    complexityScore: 'LEVEL 04 // FOUNDATIONAL',
    primaryStack: ['C99', 'Formal Verification (TLA+)', 'POSIX', 'Systems Dynamics'],
    latencyBenchmark: '0.00ns (Mental Model Overhead)',
    targetAudience: 'Architects, Systems Researchers, Lab Leads',
    artifactSlug: 'sys-phil-01.manifest',
    description: 'The foundation of engineering as a cinematic craft: managing irreducible complexity through explicit constraints, mechanical sympathy with memory hierarchies, and rejecting premature abstraction layers.',
    descriptionAr: 'أساس اعتبار الهندسة كفن سينمائي دقيق: إدارة التعقيد غير القابل للاختزال عبر قيود صارمة، والتعاطف الميكانيكي مع هرمية الذاكرة ورفض التجريدات المبكرة.',
    connectedTo: ['fullstack_architecture', 'hardware_mechanics'],
  },
  {
    id: 'fullstack_architecture',
    index: '02',
    label: 'Full-Stack Architecture',
    labelAr: 'معمارية النظم المتكاملة',
    tagline: 'Stream-native pipelines, consensus protocols, and immutable ledger backplanes',
    taglineAr: 'خطوط المعالجة الدفقية، بروتوكولات الإجماع، والطبقات الثابتة للسجلات',
    coordinates: { x: 74, y: 28 },
    complexityScore: 'LEVEL 03 // DISTRIBUTED',
    primaryStack: ['Rust', 'gRPC / FlatBuffers', 'Raft Consensus', 'eBPF Kernel Probes'],
    latencyBenchmark: '1.42ms P99 (100k req/sec)',
    targetAudience: 'Staff Engineers, Distributed Systems Teams',
    artifactSlug: 'arch-stream-consensus.spec',
    description: 'Building end-to-end reactive pipelines with deterministic state machines. Leveraging Rust memory safety and zero-copy deserialization to bridge browser viewports directly to low-level kernel streams.',
    descriptionAr: 'بناء خطوط معالجة تفاعلية متكاملة مع آلات حالات قطعية. الاستفادة من أمان ذاكرة لغة Rust وتفكيك البيانات بدون نسخ لربط واجهة المتصفح مباشرة بالأنوية.',
    connectedTo: ['systems_philosophy', 'vibe_coding', 'hardware_mechanics'],
  },
  {
    id: 'vibe_coding',
    index: '03',
    label: 'Vibe-Coding & Agentic Workflows',
    labelAr: 'البرمجة الإدراكية وسير العمل بالوكلاء',
    tagline: 'Autonomous agent orchestration, generative synthesis, and human-in-the-loop steerability',
    taglineAr: 'إدارة وتوجيه الوكلاء الأذكياء المستقلين، والتوليد البرمجي مع إبقاء المهندس في حلقة التحكم',
    coordinates: { x: 80, y: 75 },
    complexityScore: 'LEVEL 02 // EMERGENT',
    primaryStack: ['TypeScript', 'Model Context Protocol (MCP)', 'Tree-sitter AST', 'PyTorch'],
    latencyBenchmark: '140ms TTFT (Agent Reasoning Step)',
    targetAudience: 'Creative Technologists, Applied AI Researchers',
    artifactSlug: 'agent-orchestration-eval.json',
    description: 'The creative leap from linear code generation to orchestrating multi-agent systems. Treating LLMs as non-deterministic compute shaders steered by strict schema validation and deterministic regression harnesses.',
    descriptionAr: 'الانتقال الإبداعي من كتابة الكود الخطي إلى توجيه شبكات وكلاء متعددة، ومعاملة النماذج التوليدية كمعالجات حسابية غير قطعية تخضع لتدقيق بنيوي صارم.',
    connectedTo: ['fullstack_architecture', 'hardware_mechanics'],
  },
  {
    id: 'hardware_mechanics',
    index: '04',
    label: 'Hardware Mechanics',
    labelAr: 'ميكانيكا العتاد وحدود السيليكون',
    tagline: 'Cache line alignment, SIMD vectorization, PCIe bandwidth, and NUMA topologies',
    taglineAr: 'محاذاة خطوط الذاكرة المخبأة، المتجهات الحسابية SIMD، وعرض نطاق PCIe وتوزيع NUMA',
    coordinates: { x: 26, y: 78 },
    complexityScore: 'LEVEL 05 // BARE-METAL',
    primaryStack: ['AVX-512', 'CUDA / PTX', 'RDMA / RoCEv2', 'DPDK / io_uring'],
    latencyBenchmark: '8.4ns L3 Cache Hit / 62ns DRAM',
    targetAudience: 'Hardware Engineers, Graduate Research Labs',
    artifactSlug: 'baremetal-numa-profiling.asm',
    description: 'Direct exploitation of physical silicon constraints: saturating memory bus saturation, preventing false sharing in multi-core CPU topologies, and tailoring algorithms to GPU warp execution models.',
    descriptionAr: 'استغلال مباشر لحدود السيليكون الفيزيائي: إشباع ناقل الذاكرة، ومنع المشاركة الوهمية بين نوى المعالج، ومواءمة الخوارزميات مع نموذج تنفيذ خيوط معالجات الرسوميات.',
    connectedTo: ['systems_philosophy', 'fullstack_architecture'],
  },
];

export const VAULT_SNIPPETS: VaultSnippet[] = [
  {
    id: 'vault-01',
    timestamp: '04:12',
    file: 'src/consensus/raft_log_ring.rs',
    title: 'Zero-Allocation Raft State Log on Memory-Mapped Ring Buffer',
    titleAr: 'سجل ركيزة الإجماع Raft بدون تخصيص ذاكرة على حلقة محاذاة',
    complexity: 'systems_design',
    language: 'rust',
    code: `pub struct RaftLogBuffer<const CAPACITY: usize> {
    ring: [EntrySlot; CAPACITY],
    head: AtomicU64,
    commit_idx: AtomicU64,
    epoch_fence: AtomicU32,
}

impl<const CAPACITY: usize> RaftLogBuffer<CAPACITY> {
    #[inline(always)]
    pub unsafe fn append_uncheked(&self, entry: &LogEntry) -> Result<u64, LogError> {
        let current_head = self.head.fetch_add(1, Ordering::AcqRel);
        let slot = &self.ring[(current_head as usize) & (CAPACITY - 1)];
        
        // Zero-copy memmove with cache-line flush
        core::ptr::copy_nonoverlapping(
            entry as *const _ as *const u8,
            slot.as_mut_ptr(),
            core::mem::size_of::<LogEntry>(),
        );
        _mm_clflush(slot.as_ptr() as *const _);
        Ok(current_head)
    }
}`,
    takeaway: 'Guarantees P99 write latency under 12μs by bypassing malloc, pre-pinning ring slots to L3 cache lines, and utilizing hardware memory fences.',
    takeawayAr: 'يضمن تأخيراً كتابياً P99 أقل من 12 ميكروثانية عبر تجاوز التخصيص الديناميكي وتثبيت الحلقات في خطوط كاش L3.',
  },
  {
    id: 'vault-02',
    timestamp: '11:45',
    file: 'agents/orchestrator/speculative_branch.ts',
    title: 'Speculative Multi-Turn AST Synthesis with Tree-sitter Validation',
    titleAr: 'توليد شجري تكهني متوازي مع التحقق اللحظي عبر Tree-sitter',
    complexity: 'vibe_primer',
    language: 'typescript',
    code: `export async function speculativeSynthesize(
  prompt: ASTPrompt,
  branches: number = 4
): Promise<SynthesizedBranch> {
  const seeds = Array.from({ length: branches }, (_, i) => ({
    temperature: 0.15 * (i + 1),
    context: prompt.contextFrame
  }));

  const candidates = await Promise.allSettled(
    seeds.map(s => agentDispatcher.eval(s))
  );

  return candidates
    .filter(isFulfilled)
    .map(c => validateTreeSitterGrammar(c.value))
    .sort((a, b) => b.compilerDiagnosticsScore - a.compilerDiagnosticsScore)[0];
}`,
    takeaway: 'Dispatches 4 parallel speculative reasoning threads, scoring AST node consistency in under 80ms before feeding valid outputs to downstream test suites.',
    takeawayAr: 'يرسل 4 مسارات تفكير تكهنية بالتوازي مع تقييم صحة قواعد الشجرة النحوية في أقل من 80ms قبل تمرير الكود لمجموعات الاختبار.',
  },
  {
    id: 'vault-03',
    timestamp: '19:30',
    file: 'engine/pipeline/zero_copy_frame.c',
    title: 'Kernel io_uring Multi-Buffer Exchange for 4K AV1 Streams',
    titleAr: 'تبادل حزم متعدد عبر io_uring لدفق فيديو 4K AV1 المباشر',
    complexity: 'silicon_limits',
    language: 'c',
    code: `static int setup_io_uring_stream_ring(struct stream_ctx *ctx) {
    struct io_uring_sqe *sqe;
    int ret;

    ret = io_uring_queue_init(1024, &ctx->ring, IORING_SETUP_SQPOLL | IORING_SETUP_COOP_TASKRUN);
    if (ret < 0) return ret;

    /* Register direct fixed buffers to eliminate page table walk */
    ret = io_uring_register_buffers(&ctx->ring, ctx->iovecs, FRAME_RING_SLOTS);
    ctx->sqpoll_pinned_cpu = 3; // Pin to dedicated hardware thread
    return ret;
}`,
    takeaway: 'Eliminates user/kernel context switching and TLB shootdowns by binding io_uring SQPOLL threads to dedicated CPU cores with fixed memory regions.',
    takeawayAr: 'يقضي على كلفة تبديل السياق بين وضع المستخدم والنواة عبر ربط خيط معالجة SQPOLL بنواة مخصصة وذاكرة مسجلة مسبقاً.',
  },
  {
    id: 'vault-04',
    timestamp: '27:08',
    file: 'net/transport/quic_multiplex.go',
    title: 'Adaptive Flow-Controlled Multiplexing for Real-Time Telemetry',
    titleAr: 'تضمين متعدد متكيف للتحكم بالتدفق لبيانات القياس عن بُعد الحية',
    complexity: 'fullstack_arch',
    language: 'go',
    code: `func (m *MuxSession) StreamTelemetryFrame(ctx context.Context, f *TelemetryFrame) error {
    m.mu.RLock()
    stream := m.priorityStreams[f.SubsystemID]
    m.mu.RUnlock()

    if m.rttWindow.Load() > CongestionThresholdMicrosec {
        return m.dropLowerPriorityQueue(f.SubsystemID)
    }

    n, err := stream.Write(f.EncodeBinaryPayload())
    atomic.AddUint64(&m.bytesOut, uint64(n))
    return err
}`,
    takeaway: 'Dynamic congestion shedding protocol prioritizing real-time control packets over bulk snapshot payloads during sudden uplink degradations.',
    takeawayAr: 'بروتوكول تفريغ اختناق ديناميكي يمنح الأولوية لحزم التحكم اللحظية على حساب البيانات الكبيرة عند حدوث تباطؤ في الشبكة.',
  },
];

export const DOSSIER_CASE_STUDIES: DossierCaseStudy[] = [
  {
    id: 'cs-01',
    index: 'CS-SYS-801',
    title: 'Lock-Free Stream Deduplication Engine with Mechanical Cache Sympathy',
    titleAr: 'محرك إزالة تكرار البيانات المباشر الخالي من الأقفال مع التوافق مع الكاش',
    targetCommittee: 'Systems & Operating Systems Lab / Graduate Admissions (Stanford / CMU)',
    leadResearchArea: 'Distributed Systems & Memory Hierarchy',
    problemStatement: 'Modern cloud ingestion pipelines suffer catastrophic throughput collapse when duplicate event bursts trigger lock contention across high-core-count NUMA sockets. Traditional Redis or distributed hash set approaches degrade to >35ms latency at 2M events/sec.',
    problemStatementAr: 'تنهار خطوط إدخال البيانات السحابية عند حدوث طفرات تكرار مفاجئة تسبب نزاعاً على الأقفال عبر معالجات NUMA، حيث تتدهور الحلول التقليدية إلى تأخير يتجاوز 35ms عند 2 مليون حدث في الثانية.',
    systemSolution: 'Designed a partitioned, hardware-aligned circular filter utilizing SIMD AVX-512 fingerprint hashing, CPU core affinity pinning, and atomic bit-manipulation primitives with zero inter-socket cross-talk.',
    systemSolutionAr: 'تصميم مرشح حلقي مقسم ومحاذٍ للعتاد يستخدم تجزئة بصمات AVX-512 وتثبيت العمليات على نوى محددة، وعمليات ذرية تلغي تماماً التواصل البيني بين مقابس المعالجات.',
    benchmarks: [
      { metric: 'P99 Latency @ 1.5M ops/sec', metricAr: 'تأخير P99 عند 1.5M عملية/ثانية', baseline: '34.2 ms', petabyteResult: '0.84 ms', delta: '40.7x Faster' },
      { metric: 'L3 Cache Miss Rate', metricAr: 'معدل فقدان كاش L3', baseline: '18.4%', petabyteResult: '1.2%', delta: '93% Reduction' },
      { metric: 'DRAM Memory Footprint', metricAr: 'استهلاك ذاكرة RAM', baseline: '14.2 GB', petabyteResult: '1.8 GB', delta: '87% Compaction' },
      { metric: 'CPU Energy Draw / Million Ops', metricAr: 'استهلاك الطاقة لكل مليون عملية', baseline: '4.8 W·s', petabyteResult: '0.9 W·s', delta: '81% Savings' },
    ],
    architectureDiagramType: 'lock_free_ring_simd',
    paperReference: {
      venue: 'ACM SIGOPS / OSDI 2026 Submission Archive',
      doi: '10.1145/3812901.petabyte.dedup',
      preprintUrl: '#open-preprint-cs-01',
    },
  },
  {
    id: 'cs-02',
    index: 'CS-AGI-904',
    title: 'Deterministic Verification Sandboxes for Autonomous Agentic Tool Invocation',
    titleAr: 'بيئات عزل واختبار قطعية لتنفيذ أدوات الوكلاء البرمجية المستقلة',
    targetCommittee: 'AI Systems & Compilers Lab / Senior Research Scientist Admissions',
    leadResearchArea: 'Agentic AI Systems, Compilers & Program Synthesis',
    problemStatement: 'Unconstrained code-generating AI agents produce non-deterministic hallucinations, silent memory corruptions, and security boundary breaches when executing shell and compilation tasks in production developer loops.',
    problemStatementAr: 'تنتج نماذج التوليد البرمجي هلوسات غير قطعية وفساداً في الذاكرة واختراقاً للحدود الأمنية عند تشغيل أوامر الطرفية في بيئات التطوير الحية.',
    systemSolution: 'Engineered an ephemeral Linux seccomp-bpf and WebAssembly micro-sandbox runtime that instruments AST diffs, enforces strict memory bounds, and verifies semantic invariants in under 18ms before committing code.',
    systemSolutionAr: 'تطوير بيئة عزل لحظية تعتمد على seccomp-bpf وWebAssembly تفحص الفوارق النحوية AST وتفرض قيود ذاكرة صارمة وتتحقق من الثوابت الدلالية في أقل من 18ms.',
    benchmarks: [
      { metric: 'Cold Sandbox Boot Overhead', metricAr: 'وقت إقلاع بيئة العزل', baseline: '450 ms', petabyteResult: '12 ms', delta: '37x Faster' },
      { metric: 'Deterministic Regression Capture', metricAr: 'اكتشاف الأخطاء غير القطعية', baseline: '64.2%', petabyteResult: '99.4%', delta: '+35.2% Accuracy' },
      { metric: 'Malicious Payload Escape Rate', metricAr: 'معدل تسرب الأوامر الخطيرة', baseline: '4.1%', petabyteResult: '0.00%', delta: '100% Contained' },
      { metric: 'AST Verification Latency', metricAr: 'زمن فحص الشجرة النحوية', baseline: '180 ms', petabyteResult: '16 ms', delta: '11.2x Speedup' },
    ],
    architectureDiagramType: 'seccomp_wasm_agent_boundary',
    paperReference: {
      venue: 'IEEE Transactions on Software Engineering & AI',
      doi: '10.1109/TSE.2026.491028',
      preprintUrl: '#open-preprint-cs-02',
    },
  },
];

export const NETWORK_MEMBERS: NetworkMemberNode[] = [
  {
    id: 'net-01',
    callsign: 'NODE::BAGHDAD-01',
    name: 'Mustafa F. (Lead Maintainer)',
    hub: 'MENA',
    location: 'Baghdad, IQ -> Toronto, CA',
    specialty: 'Distributed Storage & Low-Level Kernel Engineering',
    activeProject: 'PetaByte Engine Core (Rust / io_uring)',
    status: 'ACTIVE_BUILD',
    latency: '14ms',
    verifiedSlackNode: true,
  },
  {
    id: 'net-02',
    callsign: 'NODE::BOSTON-04',
    name: 'Dr. Sarah K.',
    hub: 'NORTH_AMERICA',
    location: 'Cambridge, MA (MIT CSAIL)',
    specialty: 'Hardware Architecture & Neuromorphic Accelerators',
    activeProject: 'Memory Hierarchy Benchmarking Suite',
    status: 'ONLINE',
    latency: '4ms',
    verifiedSlackNode: true,
  },
  {
    id: 'net-03',
    callsign: 'NODE::DUBAI-09',
    name: 'Zaid A.',
    hub: 'MENA',
    location: 'Dubai, UAE -> San Francisco, CA',
    specialty: 'Multi-Agent Consensus & Model Context Protocols',
    activeProject: 'Autonomous AST Mutation Engine',
    status: 'DISPATCHING',
    latency: '22ms',
    verifiedSlackNode: true,
  },
  {
    id: 'net-04',
    callsign: 'NODE::WATERLOO-02',
    name: 'Elena R.',
    hub: 'NORTH_AMERICA',
    location: 'Waterloo, ON (Systems Lab)',
    specialty: 'SIMD Acceleration & High-Throughput Networking',
    activeProject: 'DPDK Packet Interceptor for Zero-Copy Pipelines',
    status: 'ONLINE',
    latency: '8ms',
    verifiedSlackNode: true,
  },
  {
    id: 'net-05',
    callsign: 'NODE::CAIRO-03',
    name: 'Omar T.',
    hub: 'MENA',
    location: 'Cairo, EG -> Seattle, WA',
    specialty: 'Formal Verification (TLA+) & Distributed Databases',
    activeProject: 'Consensus Invariant Checker',
    status: 'ACTIVE_BUILD',
    latency: '31ms',
    verifiedSlackNode: true,
  },
];
