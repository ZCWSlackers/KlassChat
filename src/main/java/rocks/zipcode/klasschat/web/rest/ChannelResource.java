package rocks.zipcode.klasschat.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import rocks.zipcode.klasschat.repository.ChannelRepository;
import rocks.zipcode.klasschat.service.ChannelService;
import rocks.zipcode.klasschat.service.dto.ChannelDTO;
import rocks.zipcode.klasschat.service.dto.MessageDTO;
import rocks.zipcode.klasschat.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link rocks.zipcode.klasschat.domain.Channel}.
 */
@RestController
@RequestMapping("/api")
public class ChannelResource {

    private final Logger log = LoggerFactory.getLogger(ChannelResource.class);

    private static final String ENTITY_NAME = "channel";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ChannelService channelService;

    private final ChannelRepository channelRepository;

    public ChannelResource(ChannelService channelService, ChannelRepository channelRepository) {
        this.channelService = channelService;
        this.channelRepository = channelRepository;
    }

    /**
     * {@code POST  /channels} : Create a new channel.
     *
     * @param channelDTO the channelDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new channelDTO, or with status {@code 400 (Bad Request)} if the channel has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/channels")
    public ResponseEntity<ChannelDTO> createChannel(@Valid @RequestBody ChannelDTO channelDTO) throws URISyntaxException {
        log.debug("REST request to save Channel : {}", channelDTO);
        if (channelDTO.getId() != null) {
            throw new BadRequestAlertException("A new channel cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ChannelDTO result = channelService.save(channelDTO);
        return ResponseEntity
            .created(new URI("/api/channels/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /channels/:id} : Updates an existing channel.
     *
     * @param id the id of the channelDTO to save.
     * @param channelDTO the channelDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated channelDTO,
     * or with status {@code 400 (Bad Request)} if the channelDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the channelDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/channels/{id}")
    public ResponseEntity<ChannelDTO> updateChannel(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody ChannelDTO channelDTO
    ) throws URISyntaxException {
        log.debug("REST request to update Channel : {}, {}", id, channelDTO);
        if (channelDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, channelDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!channelRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        ChannelDTO result = channelService.update(channelDTO);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, channelDTO.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /channels/:id} : Partial updates given fields of an existing channel, field will ignore if it is null
     *
     * @param id the id of the channelDTO to save.
     * @param channelDTO the channelDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated channelDTO,
     * or with status {@code 400 (Bad Request)} if the channelDTO is not valid,
     * or with status {@code 404 (Not Found)} if the channelDTO is not found,
     * or with status {@code 500 (Internal Server Error)} if the channelDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/channels/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<ChannelDTO> partialUpdateChannel(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody ChannelDTO channelDTO
    ) throws URISyntaxException {
        log.debug("REST request to partial update Channel partially : {}, {}", id, channelDTO);
        if (channelDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, channelDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!channelRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<ChannelDTO> result = channelService.partialUpdate(channelDTO);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, channelDTO.getId().toString())
        );
    }

    /**
     * {@code GET  /channels} : get all the channels.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of channels in body.
     */
    @GetMapping("/channels")
    public List<ChannelDTO> getAllChannels(@RequestParam(required = false, defaultValue = "false") boolean eagerload) {
        log.debug("REST request to get all Channels");
        return channelService.findAll();
    }

    /**
     * {@code GET  /channels/:id} : get the "id" channel.
     *
     * @param id the id of the channelDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the channelDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/channels/{id}")
    public ResponseEntity<ChannelDTO> getChannel(@PathVariable Long id) {
        log.debug("REST request to get Channel : {}", id);
        Optional<ChannelDTO> channelDTO = channelService.findOne(id);
        return ResponseUtil.wrapOrNotFound(channelDTO);
    }

    /**
     * {@code DELETE  /channels/:id} : delete the "id" channel.
     *
     * @param id the id of the channelDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/channels/{id}")
    public ResponseEntity<Void> deleteChannel(@PathVariable Long id) {
        log.debug("REST request to delete Channel : {}", id);
        channelService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }

    /**
     * GET /channel/workspace/{workspaceId} : Get all channels for a specific workspace by its ID.
     *
     * @param workspaceId the ID of the workspace.
     * @return the ResponseEntity with status 200 (OK) and the list of channels, or with status 404 (Not Found).
     */
    @GetMapping("/channels/workspace/{workspaceId}")
    public ResponseEntity<List<ChannelDTO>> getChannelsByWorkspaceId(@PathVariable Long workspaceId) {
        List<ChannelDTO> channels = channelService.findByWorkspaceId(workspaceId);
        return ResponseEntity.ok(channels);
    }
}
