# AI and automation tools for buildable brick (LEGO-compatible) models, instructions and renders (state as of October 2026)

Research date: 2026-10-25. Method note: many primary pages (arxiv.org, huggingface.co, github.io project pages, several product sites) could not be fetched directly from this environment (DNS/proxy refusal). GitHub repository pages and the GitHub search API did work, so repository statistics are first-hand. Most paper and product details come from search-engine extracts of the primary pages. Where a claim rests only on a secondary source, that is stated.

Target pipeline under evaluation: house floor plan or photo → 3D model → buildable brick model → stability check → step-by-step instructions → parts list → rendered build video.

---

## 1. Research and AI models (BrickGPT and its successors, image/mesh-to-brick papers, image-to-3D)

### Takeaway
Research has moved fast. BrickGPT (CMU, May 2025, ICCV 2025 Best Paper) showed that text-to-stable-brick generation works, but only on a small 20×20×20 grid with 8 basic brick types. Papers from 2026 extend this to geometry-conditioned generation (BrickAnything: point cloud to bricks), image-conditioned generation (LEGO-Maker, ResemBrick), connector-graph generation (BrickNet) and, most relevant here, agentic frameworks. In those frameworks off-the-shelf coding agents (GPT, Claude, Gemini) write LDraw through a validator: BrickWright (CMU, October 2026) and the BrickBench benchmark. None of these is yet a house-scale, production-grade generator. Physical stability analysis exists only in BrickGPT-style work (Gurobi force model) and is limited to simple brick sets.

### Cited Findings
**BrickGPT (formerly LegoGPT), CMU**
- The official repo describes BrickGPT as "the first approach for generating physically stable toy brick models from text prompts". It won the ICCV 2025 Best Paper award (Marr Prize). — [GitHub AvaLovelace1/BrickGPT](https://github.com/AvaLovelace1/BrickGPT)
- Repo stats (GitHub API, 2026-10-25): 1,728 stars, MIT licence, created 2025-03-23, last push 2026-10-23, so it is still active. — [GitHub](https://github.com/AvaLovelace1/BrickGPT)
- The model is fine-tuned from Llama-3.2-1B-Instruct. Input is a text prompt via CLI (`uv run infer`) or a Gradio demo. There is also a `src/mesh2brick` module that converts a 3D mesh to bricks. The README does not mention direct image input. — [GitHub](https://github.com/AvaLovelace1/BrickGPT)
- Outputs: `output.txt` (brick-by-brick list with dimensions and position), `output.ldr` (LDraw) and `output.png` (render made with the ImportLDraw Blender add-on). — [GitHub](https://github.com/AvaLovelace1/BrickGPT)
- Stability check: physics-based analysis using the Gurobi solver, which needs a licence (free for academics). With `--use_gurobi False` it falls back to a simpler, less accurate connectivity-based check. During generation, unstable candidates are rejected and generation is rolled back. — [GitHub](https://github.com/AvaLovelace1/BrickGPT); [arXiv 2505.05469](https://arxiv.org/pdf/2505.05469)
- Colour and texture: the `src/texture` module produces UV textures or per-brick colours using FlashTex (a submodule with its own licence). Training dataset: StableText2Brick on Hugging Face. — [GitHub](https://github.com/AvaLovelace1/BrickGPT)
- BrickBench (2026) describes BrickGPT's scope: it "fine-tunes a language model to place eight brick types on a 20×20×20 grid from a caption". — [BrickBench arXiv 2610.12452](https://arxiv.org/pdf/2610.12452v1) (via search extract)
- The paper reports that BrickGPT outperforms pre-trained LLMs, with or without in-context learning, and earlier 3D-mesh-based approaches. — [arXiv 2505.05469](https://arxiv.org/pdf/2505.05469) (via search extract)

**2026 follow-ups**
- **BrickWright** (arXiv 2610.31651, about October 2026; Ava Pun et al., CMU and Stanford): "a framework for generating physically feasible brick builds from text or image prompts using pre-trained agents". Agents write code against **BrickLayer**, a Python toolkit with an assembly API that "halves inference cost compared to working in raw LDraw", plus a validator. "Physically feasible" means real parts only, no collisions, no floating parts, and a connected structure. Reported result: 100% validity on 512 prompts versus 9–69% for baseline agents. — [arXiv 2610.31651](https://arxiv.org/abs/2610.31651); [arXiv HTML](https://arxiv.org/html/2610.31651)
- The BrickWright project page says it raises a lightweight agent ("GPT-6 Luna") from 7% to 100% physically valid builds "at 2% the price of frontier models". — [project page](https://avalovelace1.github.io/brickwright/) (via search extract; not fetched)
- BrickWright ships as a PyPI package (`brickwright` 0.1.0): "direct your favorite AI agents (GPT, Claude, Gemini, etc.) to automatically create brick builds from text or image prompts and export them to LDraw." — [PyPI brickwright](https://pypi.org/project/brickwright/0.1.0/)
- **BrickBench** (arXiv 2610.12452, dated 10 October 2026, Kulits et al.): a text-to-LEGO benchmark. Agents pick parts from a discrete library and must satisfy local and global constraints, scored on validity, alignment and design across three settings. It includes **BrickAgent**, an environment where coding agents construct, inspect and validate designs. Conclusion: leading agents mostly meet the verifiable physical and semantic requirements but still fall short of human designs. Leaderboard at brickben.ch. — [deeplearn.org abstract](https://deeplearn.org/arxiv/843570/brickbench:-evaluating-agentic-brick-design); [arXiv PDF](https://arxiv.org/pdf/2610.12452v1)
- Secondary summary of BrickBench (not verified against the paper): with BrickAgent, "GPT-6 Astra" produced a buildable design for all 300 tasks, falling to 40% without it. "GPT-5.6 Luna" managed one valid build out of 300 without the environment. Humans preferred human designs in 323 of 360 paired comparisons. — [Pebblous blog](https://blog.pebblous.ai/blog/brickbench-lego-design-benchmark/en/)
- **BrickAnything** (arXiv 2605.26182, May 2026, Ni, Yan, Guo, Wang): a geometry-conditioned autoregressive model that takes **3D point clouds** and outputs brick sequences. It uses Legolization to build about 168K stable mesh–brick training pairs and adds preference post-training, validity-constrained decoding and adaptive rollback. Reported results: 83.4% stable rate, 100% valid rate, IoU 0.586, and far fewer rollbacks than a BrickGPT-style baseline. — [arXiv 2605.26182](https://arxiv.org/abs/2605.26182); [HTML](https://arxiv.org/html/2605.26182v1)
- **Rollback-Free Stable Brick Structures Generation** (arXiv 2605.06947, May 2026): the title suggests it removes BrickGPT's rollback step. Its content could not be retrieved. — [arXiv 2605.06947](https://arxiv.org/pdf/2605.06947)
- **ResemBrick: Brick Reconstruction from Photographs with Perceptual Fidelity and Buildability** (arXiv 2608.09597, August 2026): photo to brick reconstruction. Its abstract and results could not be retrieved, only the reference list (which cites Legolization and StableLego). — [arXiv 2608.09597](https://arxiv.org/pdf/2608.09597)
- **LEGO-Maker** (ACM TOG / SIGGRAPH Asia 2025, doi 10.1145/3763285): an autoregressive **image-conditioned** LEGO model creator. It handles more than 100 brick types and uses multi-token prediction plus rollback to keep generation collision-free. BrickWright describes it as limited to axis-aligned orientations and two categories. — [ACM DL](https://dl.acm.org/doi/10.1145/3763285); [BrickWright](https://arxiv.org/html/2610.31651)
- **LegoACE** (SIGGRAPH Asia 2025): a decoder-only transformer that generates assemblies brick by brick (position, orientation, type). Connections are learned implicitly, and BrickWright notes it can produce disconnected components. — [ACM DL](https://dl.acm.org/doi/10.1145/3757377.3763881)
- **BrickNet: Graph-Backed Generative Brick Assembly** (arXiv 2604.22984; CVPR 2026 poster; Kulits & Schmid): predicts connections through typed connectors instead of positions. BrickWright notes that collisions accumulate over long sequences. — [arXiv 2604.22984](https://arxiv.org/pdf/2604.22984); [CVPR 2026 poster](https://cvpr.thecvf.com/virtual/2026/poster/38805)
- **Prompt-to-Parts** (arXiv 2512.15743, December 2025, D. Noever, single author): an LLM plus tools generates LDraw step-by-step instructions within a fixed parts vocabulary. Examples: an ISS model with 3,122 parts and a 112-page manual, and an 860-part castle with 83 steps. The author concedes the system **cannot verify whether an assembly would hold together under load** and can produce "geometrically valid but physically unrealizable assemblies". It also introduces a Python library for programmatic model generation. — [arXiv 2512.15743](https://arxiv.org/pdf/2512.15743)
- Older baselines: Image2Lego (arXiv 2108.08477, 2021) goes image → voxel 3D model → LEGO set. — [arXiv 2108.08477](https://arxiv.org/pdf/2108.08477). Computational LEGO Technic Design (arXiv 2007.02245). — [arXiv](https://arxiv.org/pdf/2007.02245). "Learn to Create Simple LEGO Micro Buildings" (ACM TOG 2024) targets micro-scale buildings. — [ACM DL](https://dl.acm.org/doi/10.1145/3687755)

**brickr**
- ryantimpe/brickr is an R package for "3D LEGO models and mosaics from images". It has 443 stars, last push 2023-11-27, and no SPDX licence detected. It is effectively dormant. — [GitHub ryantimpe/brickr](https://github.com/ryantimpe/brickr)

**Image-to-3D foundation models (step "photo → 3D model")**
- microsoft/TRELLIS: 14,106 stars, MIT licence, last push 2026-06-26 (CVPR'25 Spotlight, "Structured 3D Latents"). microsoft/TRELLIS.2: 12,455 stars, MIT licence, created 2025-11-26, last push 2026-07-10. — [GitHub TRELLIS](https://github.com/microsoft/TRELLIS); [GitHub TRELLIS.2](https://github.com/microsoft/TRELLIS.2)
- Tencent-Hunyuan/Hunyuan3D-2: 15,200 stars, last push 2025-10-28. Hunyuan3D-2.1 ("Images to High-Fidelity 3D Assets with Production-Ready PBR Material"): 4,279 stars, last push 2025-10-17. The licence is reported as NOASSERTION (Tencent custom licence). — [GitHub Hunyuan3D-2](https://github.com/Tencent-Hunyuan/Hunyuan3D-2); [GitHub Hunyuan3D-2.1](https://github.com/Tencent-Hunyuan/Hunyuan3D-2.1)

### Inferences
- A research-grade "image → mesh (TRELLIS/Hunyuan3D) → bricks" chain is technically assemblable today from open components: BrickGPT `mesh2brick` or a Legolization-style voxeliser, the BrickGPT stability checker, and LDraw output. Each link is research code, not a product.
- In 2026 the field has shifted from training dedicated models toward **agents plus validator tools** (BrickWright, BrickBench/BrickAgent, ldraw-nova). For a startup, this is the most practical route: use a frontier LLM to drive an LDraw toolkit with automated validation.
- "Validity" in agentic work (no collisions, no floating parts, connected structure) is weaker than BrickGPT's force-based stability. Real structural stability for large, complex models with SNOT, plates and slopes remains largely unsolved in the open literature.
- The licence split matters commercially. BrickGPT is MIT (but Gurobi needs a commercial licence outside academia), TRELLIS is MIT, Hunyuan3D uses Tencent's custom licence, and ldraw-nova is AGPL-3.0.

### Gaps
- I could not read the full BrickWright, BrickBench, ResemBrick or Rollback-Free papers. The BrickWright code licence, the BrickBench per-model scores (including any Claude results) and the ResemBrick method are unverified.
- The model names in secondary sources ("GPT-6 Astra", "GPT-6 Luna", "GPT-5.6 Luna") could not be checked against the primary papers.
- I found no evaluation of BrickGPT-class methods on **buildings or houses** specifically.
- I found no source documenting a TRELLIS/Hunyuan3D/Meshy → brick pipeline with measured quality.

---

## 2. Commercial and consumer tools (what they actually output)

### Takeaway
Most "photo to LEGO" consumer services produce **images** (brick-style art) or minifigure matches, not buildable models. Only a few claim real buildable output with a parts list. Brick My World (scan/photo → voxelised brick model → PDF + LDraw + brick list) and Brick Quest (photo → 3D model + physics check + interactive instructions + BrickLink parts list) are the clearest. I found no independent verification of the quality of either.

### Cited Findings
- **Brick My World** (brickmyworld.ai; Czech developer Iva Papoušková): uses photogrammetry via ARKit/ARCore to capture an object, then "AI-assisted voxelization" into a brick model, then build instructions. It also converts uploaded .obj/.usdz/.gltf files. Outputs are PDF instructions and .ldr (LDraw) files plus a brick list, with Brick Owl integration for sourcing. — [Core77](https://www.core77.com/posts/134562/Brilliant-Smartphone-App-Generates-Lego-Plans-for-Real-World-Objects); [New Atlas](https://newatlas.com/consumer-tech/lego-builder-kickstarter/); [App Store](https://apps.apple.com/app/id6739494216)
- Brick My World pricing varies by source and date: Kickstarter lifetime $99 (planned $200/year), Indiegogo lifetime $129 (planned $199/year), App Store in-app purchase $4.99 for "PDF Instructions + Brick List". User reviews are mixed ("I scanned a toy and it looks like mush"). — [New Atlas](https://newatlas.com/consumer-tech/lego-builder-kickstarter/); [Indiegogo](https://indiegogo.com/projects/brick-my-world-convert-objects-into-lego-model); [App Store](https://apps.apple.com/app/id6739494216)
- **Brick Quest** (brick-quest.park-labs.com): its "Photo to LEGO" mode generates a 3D model from a photo, runs a physics check for buildability, and provides interactive 3D instructions plus a BrickLink parts list (per its website as extracted by search; not independently tested). — [Brick Quest](https://brick-quest.park-labs.com/en)
- **brickgpt.online** (not affiliated with CMU as far as the sources show): takes one photo of a *finished* model and produces an instruction-style steps board and a short assembly video. It does **not** produce an official PDF or a detailed parts list. — [brickgpt.online](https://brickgpt.online/ai-lego-instruction-generator)
- **brickbuilder.ai** published a blog post "Using AI to Design LEGO in 2026" which groups BrickGPT with LegoACE and LEGO-Maker as specialised systems and says general-purpose LLMs still struggle with reliable 3D spatial constraints. I could not fetch the page to confirm brickbuilder.ai's own product outputs. — [brickbuilder.ai blog](https://brickbuilder.ai/blog/using-ai-to-design-lego-in-2026)
- **Brickify** (brickify.fun): matches a photo to official LEGO **minifigure** pieces and gives element codes. It works on tokens and does not sell or ship parts. — [Brickify](https://brickify.fun/en/); [IndieHackers](https://www.indiehackers.com/product/brickify)
- **Cartoonize** (cartoonize.ai/lego): a free photo to "LEGO-style brick image" converter. Its output is artwork only, with no parts list or instructions. — [Cartoonize](https://cartoonize.ai/lego)
- **BrickCenter**: text or image → "LEGO-style sets and minifigures" images. One listing gives the Pro tier as $9.9/month. ImagineArt and Fotor offer similar image-only generators. — [topai.tools](https://topai.tools/t/brickcenter); [Fotor](https://www.fotor.com/ai-image-generator/lego/)
- **Brickit** (brickit.app): scans a pile of the user's loose bricks, identifies the pieces and suggests builds with step-by-step instructions. It works from a pre-designed library rather than generating custom models from a photo. — [Brickit](https://brickit.app/)
- **Mosaic tools**: photo → 2D LEGO mosaic generators exist (e.g. makebead.com "Free LEGO Mosaic Maker"). They output flat stud mosaics, not 3D models. — [makebead](https://makebead.com/lego-mosaic-maker/)
- **Vorla**: no search results identify it. An unnamed early-stage waitlist (Notion page) advertises "AI-generated LEGO models … smart instructions" for real objects, but it cannot be linked to Vorla. — [Notion waitlist](https://chip-bramble-329.notion.site/Turn-Anything-You-Want-Into-LEGO-1db5c94a9f0080cf8584da04fb2aa8d2)

### Inferences
- The market splits into (a) image-only "LEGO-style" generators, which are numerous, cheap and not buildable; (b) minifigure matchers; and (c) a few buildable-model generators (Brick My World, Brick Quest) with weak or unverified quality, especially for large or complex subjects like houses.
- No consumer tool among those found says it handles architecture specifically, or turns floor plans into models.

### Gaps
- I could not fetch the Brick Quest, Brick My World, brickgpt.online or brickbuilder.ai sites directly. Claims rest on search extracts and press coverage.
- No information was found on Vorla. The official LEGO Mosaic Maker store booth status in 2026 was not verified.
- No independent test was found of the part-count accuracy, stability or real-world buildability of Brick My World or Brick Quest output.

---

## 3. Brick CAD and pipeline tooling (LDraw, Studio, LeoCAD, LPub3D, Blender add-ons, web loaders, APIs)

### Takeaway
The downstream half of the pipeline (LDraw model → instructions → parts list → render) is the most mature and largely automatable with open-source tools: the LDraw format, LeoCAD, LPub3D with a batch/headless mode, the ImportLDraw Blender add-on, three.js LDrawLoader, and the Rebrickable API for part mapping. BrickLink Studio is the best all-in-one GUI (Instruction Maker, rendering, BrickLink price/order integration), but it is closed-source with no documented scripting API. Its .io files are ZIP-wrapped LDraw, so they can be generated programmatically.

### Cited Findings
- **LDraw** is an open standard for LEGO CAD. BrickLink Studio uses the LDraw format and bundles its own LDraw library. — [LDraw wiki: BrickLink Studio](https://wiki.ldraw.org/wiki/Category:BrickLink_Studio)
- **BrickLink Studio**: the latest version is v2.26.9_1, released 30 September 2026. It runs on Windows 10+ and macOS 10.13+, and the download page says it "only supports Nvidia graphics cards". The Instruction Maker, photorealistic rendering and BrickLink integration for ordering parts were added in the 2.0 era. — [BrickLink Studio download](https://www.bricklink.com/v3/studio/download.page); [Wikipedia](https://en.wikipedia.org/wiki/BrickLink_Studio)
- Studio's native .io files are ZIP archives whose inner model.ldr is standard LDraw. Studio can also File > Export As LDraw. Textured parts use BrickLink's proprietary texture commands rather than the official spec. — [LDraw wiki](https://wiki.ldraw.org/wiki/Category:BrickLink_Studio); [Rebrickable Studio guide](https://rebrickable.com/help/guide-to-stud-io/); [Eurobricks thread](https://www.eurobricks.com/forum/forums/topic/175033-converting-parts-with-textures-from-studio-to-ldraw/); [Studio import formats](https://studiohelp.bricklink.com/hc/en-us/articles/6502277722647-Import-formats)
- Studio is closed-source and free to use. — [AlternativeTo](https://alternativeto.net/software/bricklink-studio)
- **LeoCAD** (leozide/leocad): 2,894 stars, last push 2026-10-25, actively maintained. ldraw-nova uses it for BOM comparison. — [GitHub leozide/leocad](https://github.com/leozide/leocad); [GitHub ldraw-nova](https://github.com/anteloc/ldraw-nova)
- **LPub3D** (trevorsandy/lpub3d), "An LDraw editor for LEGO style digital building instructions": 203 stars, last push 2026-06-30. Its feature list includes "Console commands – enabling 'Batch' mode" and "'Headless' mode on Linux, macOS and Windows", with export to PDF, PNG, JPG and BMP. A 2022 forum post claiming there is no direct PDF export appears outdated. — [GitHub](https://github.com/trevorsandy/lpub3d); [LinuxLinks](https://www.linuxlinks.com/lpub3d-ldraw-editor-lego-style-digital-building-instructions/); [LDraw forum](https://forums.ldraw.org/printthread.php?tid=22068)
- **ImportLDraw** Blender add-on (TobyLobster/ImportLDraw): 378 stars, GPL-2.0, last push 2026-10-06. BrickGPT uses it for rendering. The alternative ldr_tools_blender (ScanMountGoat) also exists. — [GitHub ImportLDraw](https://github.com/TobyLobster/ImportLDraw); [GitHub ldr_tools_blender](https://github.com/ScanMountGoat/ldr_tools_blender)
- **Bricker** (Blender add-on): a **paid** add-on on Blender Market/Superhive that "converts any 3D mesh into a photo-real 3D brick model". The latest version supports Blender 4.2–4.5. Marketplace pages state no open-source licence. A 2020 opensource.com article covered it. — [Superhive Bricker](https://superhivemarket.com/products/bricker); [docs](https://superhivemarket.com/products/bricker/docs); [opensource.com 2020](https://opensource.com/article/20/7/lego-blender-bricker)
- **Mecabricks**: a web service for creating, publishing and rendering LEGO 3D models. It is free and proprietary. — [AlternativeTo listing](https://alternativeto.net/software/bricklink-studio)
- **Rebrickable**: API v3 covers the catalog, set inventories, BOMs and LDraw cross-referencing. Daily catalog dumps total about 18 MB gzipped. It maintains a mapping between LDraw, BrickLink, Rebrickable and Brick Owl part numbers. Older posts note gaps, for example parts that appear in no inventoried set. — [PyPI rebrickable](https://pypi.org/project/rebrickable/); [Eurobricks thread](https://www.eurobricks.com/forum/forums/topic/140643-open-and-freely-available-data-set-of-all-partspieces); [MS connector docs](https://learn.microsoft.com/en-us/connectors/rebrickableip/)
- **three.js** (MIT, about 117k stars, active) includes an LDrawLoader for browser rendering of LDraw models. — [GitHub mrdoob/three.js](https://github.com/mrdoob/three.js); [three.js example webgl_loader_ldraw](https://threejs.org/examples/#webgl_loader_ldraw)
- Brickognize (part, set and minifigure image recognition) is available through an MCP server listing. — [Glama brickognize-mcp](https://glama.ai/mcp/servers/NazarLysyi/brickognize-mcp/tools/brickognize_identify)

### Inferences
- A fully headless chain is feasible with open tools. Write LDraw/MPD with step markers (`0 STEP`). Generate the BOM by parsing the LDraw (as ldraw-nova does) and map it to BrickLink/BrickOwl IDs via Rebrickable. Produce PDF instructions with LPub3D in batch mode. Render stills or a build animation with Blender + ImportLDraw (scriptable via Blender Python) or three.js in the browser.
- BrickLink Studio is useful as a human QA/finishing step (Instruction Maker, BrickLink price estimate, and its built-in stability/collision checks, which I did not verify in sources this round). Without a scripting API, though, it is a manual bottleneck in an automated pipeline.
- Step ordering for instructions: Prompt-to-Parts and BrickGPT generate parts sequentially (bottom-up), which gives a natural build order. Designing good human-readable steps (sub-assemblies, callouts) remains manual.

### Gaps
- I did not verify the exact LPub3D batch CLI flags or a PDF automation example.
- I found no documentation of a BrickLink Studio scripting API, CLI or price-estimate API. Absence is not confirmed by an official statement.
- BrickLink API (OAuth 1.0 price guide) details were not retrieved.
- The size of the LDraw official parts library in 2026 was not found.
- Bricker's source licence and whether it exports LDraw were not confirmed.

---

## 4. Floor plan → 3D

### Takeaway
Floor-plan raster-to-vector reconstruction is an active research area (2025–2026 papers: Raster2Seq, CAGE, FloorSAM, evidence-gated multimodal parsing). The best-known open-source Blender tool, FloorplanToBlender3d, is dormant since 2024. Published accuracy is in the 0.76–0.90 IoU/precision range on benchmark datasets. That is good enough for walls and rooms, but not for façade details (windows, roofs, materials), which matter for a recognisable LEGO house.

### Cited Findings
- **FloorplanToBlender3d** (grebtsew): "Create 3d rooms in blender from floorplans". GPL-3.0, 635 stars, last push 2024-10-09. — [GitHub](https://github.com/grebtsew/FloorplanToBlender3d)
- Raster-to-Vector (ICCV 2017) reports about 90% precision and recall on floorplan transformation and converted a hundred thousand production-level floorplan images into vector form. — [Raster-to-Vector project page](https://art-programmer.github.io/floorplan-transformation.html)
- Multi-unit floor plan recognition (arXiv 2408.01526, 2024): average F1 0.86 and IoU 0.76. — [arXiv 2408.01526](https://arxiv.org/html/2408.01526v1)
- Further 2025–2026 papers: Raster2Seq (arXiv 2602.09016), CAGE (arXiv 2509.15459), FloorSAM (arXiv 2509.15750), and evidence-gated multimodal parsing and vectorisation (arXiv 2609.25615). Their abstracts could not be retrieved. — [Raster2Seq](https://arxiv.org/pdf/2602.09016); [CAGE](https://arxiv.org/pdf/2509.15459); [FloorSAM](https://arxiv.org/pdf/2509.15750); [Evidence-gated](https://arxiv.org/pdf/2609.25615)
- Semantic 3D models from 2D plans: arXiv 2306.01642. — [arXiv 2306.01642](https://arxiv.org/pdf/2306.01642)
- Vendor claim (Neural4D, marketing): image-to-3D tools produce a watertight mesh from a floor-plan photo in about 90 seconds. Cluttered sketches, thin walls and heavy shading confuse wall detection. No metrics are given. — [Neural4D newsletter](https://newsletter.neural4d.com/p/floor-plan-to-3d-how-to-convert-with-ai-in-3-minutes)
- A stereo-vision method (MDPI Buildings 2025) reports relative errors within 6% for architectural components of existing buildings. — [MDPI](https://www.mdpi.com/2075-5309/16/7/1310)

### Inferences
- A floor plan gives only footprint and interior layout. For a LEGO house kit, elevation and photo data (façade, roof shape, windows) matter more than interior walls. A practical pipeline likely needs footprint (from the plan) plus façade photos (image-to-3D or manual), or a human designer.
- At LEGO scale (minifig scale, roughly 1:40, or micro-scale), floor-plan precision beyond about 5–10% is irrelevant, because quantisation to studs (8 mm) dominates.

### Gaps
- I found no information on PlanWalk or other commercial floor-plan → 3D products, and no accuracy data for them.
- The open-source code availability and accuracy of the 2025–2026 floor-plan papers were not confirmed.

---

## 5. Does anyone already offer "house/building → LEGO kit with instructions" end-to-end? LLM agents generating LDraw?

### Takeaway
No company was found offering a fully **automated** house → LEGO kit pipeline. The house-replica market is served by **human designers** (Etsy shops such as Little Brick Lane and Brick Model Design) charging about $50 for digital instructions and $300–350+ for kits or built models. Generic AI object-to-brick tools (Brick My World, Brick Quest) exist but are not building-specific. LLM agents generating LDraw are now a real, documented thing (BrickWright, BrickBench, ldraw-nova, Prompt-to-Parts). Physical buildability of agent output is still largely unverified.

### Cited Findings
- Etsy: "Custom LEGO House Design Only From Photos – PDF Instructions & Parts List (no Bricks)" for about $50 (one exterior design, downloadable PDF, element-ID parts list). Other listings: a custom house design + brick kit for about $300, and a built replica for about $350. — [Etsy listing 4597655691](https://www.etsy.com/listing/4597655691/custom-lego-house-design-from-photos-pdf); [Etsy facade set](https://www.etsy.com/listing/4389317927/custom-lego-home-facade-set-o); [Etsy custom buildings](https://www.etsy.com/listing/184531823/lego-custom-buildings-made-for-you-to-be)
- **Little Brick Lane** (Shari Austrian): turns photos and plans of a house into LEGO scale models using new branded bricks. A roughly three-year-old article reports an 8–10 week wait. — [Hyperallergic](https://hyperallergic.com/lego-house-shari-austrian-little-brick-lane/); [Apartment Therapy](https://www.apartmenttherapy.com/etsy-lego-custom-home-design-miniatures-255019)
- **Brick Model Design** (Jason Burik): custom LEGO home replicas, free quote, sample models 6–12" long. — [brickmodeldesign.com](https://www.brickmodeldesign.com/homes/)
- LEGO's own custom service, Design byME, was discontinued in late 2011. — [Wikipedia](https://en.wikipedia.org/wiki/Lego_Design_byME)
- **ldraw-nova** (anteloc/ldraw-nova; AGPL-3.0; created 2026-09-23; 480 stars; last push 2026-10-25; v0.6.0): "Agent tooling for generative LEGO models building, built with Astra and Opus 5.5". The agent writes JSON plans (plus optional Python) using LDraw parts. Outputs: an editable MPD model, a validation report, a parts list (BOM), a LeoCAD BOM comparison, PNG previews, GLB export, and a web/VR viewer. Its checks "don't certify collision freedom, strength, motion, or real part availability". — [GitHub ldraw-nova](https://github.com/anteloc/ldraw-nova)
- Press on ldraw-nova: a 2,175-piece virtual "Sakura Garden" credited to Claude Opus 5.5. The developer (Carlos Antelo) acknowledges the collision checks do not model structural stability and says he had not built the showcased designs physically. — [remio.ai](https://www.remio.ai/post/ldraw-nova-lego-design-reaches-2-175-pieces-but-physical-buildability-remains-un) (a single source republished in many languages)
- BrickWright explicitly supports driving GPT, Claude, Gemini and other agents to create builds from text **or image** prompts and export LDraw. — [PyPI brickwright](https://pypi.org/project/brickwright/0.1.0/)
- Prompt-to-Parts (December 2025) demonstrates LLM + tools producing LDraw kits of 3,000+ parts with 100+ page manuals, but without load verification. — [arXiv 2512.15743](https://arxiv.org/pdf/2512.15743)
- A 2023 OpenAI community post describes a custom GPT "transforming photos into Lego" (image-based). — [OpenAI community](https://community.openai.com/t/a-gpt-success-story-transforming-photos-into-lego/568735)
- CMU's lab frames the broader goal as creating physical assembly products directly from text prompts, with LEGO as the testbed (including robotic assembly). — [CMU iControl lab](https://icontrol.ri.cmu.edu/research/lego.html); [CMU on X](https://x.com/CarnegieMellon/status/1957844570361692551)

### Inferences
- There is a clear gap between human-designed custom house kits ($50–350+, weeks of lead time) and AI tools (generic objects, unverified buildability). A semi-automated "AI draft + human designer QA" service for houses appears not to exist as a branded product, as far as these searches show.
- Mid-2026 agentic tools (BrickWright, ldraw-nova) make the "LLM writes LDraw" step credible. Stability verification and human-quality instruction design remain the bottlenecks.

### Gaps
- I cannot rule out small or new startups (e.g. "Vorla") offering house-specific AI kits. None were found.
- No source documented a real-world physical build of a fully AI-generated house model.

---

## 6. LLM agents with computer use / MCP driving Blender or Studio

### Takeaway
Blender MCP integration is mature and popular. The community `blender-mcp` (renamed mcp-for-blender in September 2026) has about 29k stars, and Blender Lab has an official MCP server requiring Blender 5.1+. So rendering and animation of LDraw models via an agent is practical. I found no MCP server or automation API for BrickLink Studio. Driving Studio would require GUI computer-use, which is fragile. For bricks specifically, purpose-built Python toolkits (BrickLayer/BrickWright, ldraw-nova) are a better agent interface than CAD GUIs.

### Cited Findings
- The community Blender MCP (ahujasid) had about 29.3k stars as of 25 September 2026. On 16 September 2026 it was renamed to ahujasid/mcp-for-blender (PyPI `mcp-for-blender`; `uvx blender-mcp` still works). — [StraySpark comparison 2026](https://www.strayspark.studio/blog/official-blender-mcp-server-comparison-2026); [Star History](https://www.star-history.com/ahujasid/mcp-for-blender)
- Maintenance signals conflict. A review covering January–May 2026 reported no maintainer commits since 23 January 2026, while the September 2026 comparison cites a current PyPI release 2.1.0. — [ChatForest review](https://chatforest.com/reviews/blender-mcp-server/); [StraySpark](https://www.strayspark.studio/blog/official-blender-mcp-server-comparison-2026)
- Blender Lab offers a separate **official** Blender MCP server requiring Blender 5.1 or newer. — [StraySpark](https://www.strayspark.studio/blog/official-blender-mcp-server-comparison-2026)
- BrickWright's BrickLayer API "halves inference cost compared to working in raw LDraw", which supports the case for domain-specific tool APIs over raw-format or GUI driving. — [arXiv 2610.31651](https://arxiv.org/html/2610.31651)
- BrickBench provides BrickAgent, an environment for coding agents to construct, inspect and validate designs. — [deeplearn.org](https://deeplearn.org/arxiv/843570/brickbench:-evaluating-agentic-brick-design)

### Inferences
- Recommended automation boundary: an agent plus a Python/LDraw toolkit for design and validation, Blender via script or MCP for renders and build-video animation (step-by-step part appearance), and LPub3D headless for PDF. Studio is optional and manual.
- A build video can be produced by importing the LDraw (ImportLDraw) with STEP metadata and keyframing part visibility per step in Blender Python. I found no ready-made open-source tool that does this for build videos specifically. That is an inference, not a cited finding.

### Gaps
- I found no evidence of any MCP server or computer-use demo for BrickLink Studio, LeoCAD or Mecabricks.
- I found no source quantifying the reliability of Blender MCP for production rendering pipelines.

---

### Summary matrix (cross-cutting, all sections): pipeline step → automation maturity (as of October 2026)

| Step | Best available tools | Maturity | Key limits | Sources |
|---|---|---|---|---|
| Floor plan → 3D | FloorplanToBlender3d (GPL, dormant 2024); research (Raster2Seq, CAGE, FloorSAM) | Medium (walls/rooms) | No façade/roof; ~0.76–0.90 IoU/precision in research | [GitHub](https://github.com/grebtsew/FloorplanToBlender3d); [arXiv 2408.01526](https://arxiv.org/html/2408.01526v1) |
| Photo → 3D mesh | TRELLIS / TRELLIS.2 (MIT), Hunyuan3D-2/2.1 (Tencent licence) | High for objects | Buildings from one photo: unverified | [TRELLIS](https://github.com/microsoft/TRELLIS); [Hunyuan3D](https://github.com/Tencent-Hunyuan/Hunyuan3D-2) |
| Mesh/image/text → bricks | BrickGPT mesh2brick (MIT), BrickAnything, LEGO-Maker, BrickWright (agents), Bricker (paid Blender add-on), Brick My World (app) | Research / early product | Small grids or limited part sets; unverified large scale | [BrickGPT](https://github.com/AvaLovelace1/BrickGPT); [BrickAnything](https://arxiv.org/abs/2605.26182); [BrickWright](https://arxiv.org/abs/2610.31651) |
| Stability check | BrickGPT Gurobi force analysis; BrickWright/BrickAgent validity validators | Research | Force analysis only for simple bricks; agent validators = collision + connectivity only | [BrickGPT](https://github.com/AvaLovelace1/BrickGPT); [remio on ldraw-nova](https://www.remio.ai/post/ldraw-nova-lego-design-reaches-2-175-pieces-but-physical-buildability-remains-un) |
| Instructions | LPub3D (batch/headless, PDF), Studio Instruction Maker (GUI), Prompt-to-Parts | High (mechanical) / Low (good step design) | Human-quality sub-assembly design not automated | [LinuxLinks](https://www.linuxlinks.com/lpub3d-ldraw-editor-lego-style-digital-building-instructions/); [arXiv 2512.15743](https://arxiv.org/pdf/2512.15743) |
| Parts list + pricing | LDraw parse → Rebrickable mapping → BrickLink/BrickOwl; Studio price estimate | High | Part-ID mapping gaps; Studio not scriptable | [PyPI rebrickable](https://pypi.org/project/rebrickable/) |
| Render / build video | Blender + ImportLDraw (GPL-2.0), Blender MCP, three.js LDrawLoader, Studio renderer | High (stills) / Medium (video needs custom scripting) | No turnkey build-video tool found | [ImportLDraw](https://github.com/TobyLobster/ImportLDraw); [StraySpark](https://www.strayspark.studio/blog/official-blender-mcp-server-comparison-2026) |
