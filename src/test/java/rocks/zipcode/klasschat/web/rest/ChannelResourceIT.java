package rocks.zipcode.klasschat.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import rocks.zipcode.klasschat.IntegrationTest;
import rocks.zipcode.klasschat.domain.Channel;
import rocks.zipcode.klasschat.repository.ChannelRepository;
import rocks.zipcode.klasschat.service.ChannelService;
import rocks.zipcode.klasschat.service.dto.ChannelDTO;
import rocks.zipcode.klasschat.service.mapper.ChannelMapper;

/**
 * Integration tests for the {@link ChannelResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class ChannelResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/channels";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ChannelRepository channelRepository;

    @Mock
    private ChannelRepository channelRepositoryMock;

    @Autowired
    private ChannelMapper channelMapper;

    @Mock
    private ChannelService channelServiceMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restChannelMockMvc;

    private Channel channel;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Channel createEntity(EntityManager em) {
        Channel channel = new Channel().name(DEFAULT_NAME).description(DEFAULT_DESCRIPTION);
        return channel;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Channel createUpdatedEntity(EntityManager em) {
        Channel channel = new Channel().name(UPDATED_NAME).description(UPDATED_DESCRIPTION);
        return channel;
    }

    @BeforeEach
    public void initTest() {
        channel = createEntity(em);
    }

    @Test
    @Transactional
    void createChannel() throws Exception {
        int databaseSizeBeforeCreate = channelRepository.findAll().size();
        // Create the Channel
        ChannelDTO channelDTO = channelMapper.toDto(channel);
        restChannelMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(channelDTO)))
            .andExpect(status().isCreated());

        // Validate the Channel in the database
        List<Channel> channelList = channelRepository.findAll();
        assertThat(channelList).hasSize(databaseSizeBeforeCreate + 1);
        Channel testChannel = channelList.get(channelList.size() - 1);
        assertThat(testChannel.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testChannel.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
    }

    @Test
    @Transactional
    void createChannelWithExistingId() throws Exception {
        // Create the Channel with an existing ID
        channel.setId(1L);
        ChannelDTO channelDTO = channelMapper.toDto(channel);

        int databaseSizeBeforeCreate = channelRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restChannelMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(channelDTO)))
            .andExpect(status().isBadRequest());

        // Validate the Channel in the database
        List<Channel> channelList = channelRepository.findAll();
        assertThat(channelList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = channelRepository.findAll().size();
        // set the field null
        channel.setName(null);

        // Create the Channel, which fails.
        ChannelDTO channelDTO = channelMapper.toDto(channel);

        restChannelMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(channelDTO)))
            .andExpect(status().isBadRequest());

        List<Channel> channelList = channelRepository.findAll();
        assertThat(channelList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllChannels() throws Exception {
        // Initialize the database
        channelRepository.saveAndFlush(channel);

        // Get all the channelList
        restChannelMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(channel.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllChannelsWithEagerRelationshipsIsEnabled() throws Exception {
        when(channelServiceMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restChannelMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(channelServiceMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllChannelsWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(channelServiceMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restChannelMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(channelRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @Transactional
    void getChannel() throws Exception {
        // Initialize the database
        channelRepository.saveAndFlush(channel);

        // Get the channel
        restChannelMockMvc
            .perform(get(ENTITY_API_URL_ID, channel.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(channel.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION));
    }

    @Test
    @Transactional
    void getNonExistingChannel() throws Exception {
        // Get the channel
        restChannelMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingChannel() throws Exception {
        // Initialize the database
        channelRepository.saveAndFlush(channel);

        int databaseSizeBeforeUpdate = channelRepository.findAll().size();

        // Update the channel
        Channel updatedChannel = channelRepository.findById(channel.getId()).get();
        // Disconnect from session so that the updates on updatedChannel are not directly saved in db
        em.detach(updatedChannel);
        updatedChannel.name(UPDATED_NAME).description(UPDATED_DESCRIPTION);
        ChannelDTO channelDTO = channelMapper.toDto(updatedChannel);

        restChannelMockMvc
            .perform(
                put(ENTITY_API_URL_ID, channelDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(channelDTO))
            )
            .andExpect(status().isOk());

        // Validate the Channel in the database
        List<Channel> channelList = channelRepository.findAll();
        assertThat(channelList).hasSize(databaseSizeBeforeUpdate);
        Channel testChannel = channelList.get(channelList.size() - 1);
        assertThat(testChannel.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testChannel.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
    }

    @Test
    @Transactional
    void putNonExistingChannel() throws Exception {
        int databaseSizeBeforeUpdate = channelRepository.findAll().size();
        channel.setId(count.incrementAndGet());

        // Create the Channel
        ChannelDTO channelDTO = channelMapper.toDto(channel);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restChannelMockMvc
            .perform(
                put(ENTITY_API_URL_ID, channelDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(channelDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Channel in the database
        List<Channel> channelList = channelRepository.findAll();
        assertThat(channelList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchChannel() throws Exception {
        int databaseSizeBeforeUpdate = channelRepository.findAll().size();
        channel.setId(count.incrementAndGet());

        // Create the Channel
        ChannelDTO channelDTO = channelMapper.toDto(channel);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restChannelMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(channelDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Channel in the database
        List<Channel> channelList = channelRepository.findAll();
        assertThat(channelList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamChannel() throws Exception {
        int databaseSizeBeforeUpdate = channelRepository.findAll().size();
        channel.setId(count.incrementAndGet());

        // Create the Channel
        ChannelDTO channelDTO = channelMapper.toDto(channel);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restChannelMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(channelDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Channel in the database
        List<Channel> channelList = channelRepository.findAll();
        assertThat(channelList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateChannelWithPatch() throws Exception {
        // Initialize the database
        channelRepository.saveAndFlush(channel);

        int databaseSizeBeforeUpdate = channelRepository.findAll().size();

        // Update the channel using partial update
        Channel partialUpdatedChannel = new Channel();
        partialUpdatedChannel.setId(channel.getId());

        partialUpdatedChannel.name(UPDATED_NAME).description(UPDATED_DESCRIPTION);

        restChannelMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedChannel.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedChannel))
            )
            .andExpect(status().isOk());

        // Validate the Channel in the database
        List<Channel> channelList = channelRepository.findAll();
        assertThat(channelList).hasSize(databaseSizeBeforeUpdate);
        Channel testChannel = channelList.get(channelList.size() - 1);
        assertThat(testChannel.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testChannel.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
    }

    @Test
    @Transactional
    void fullUpdateChannelWithPatch() throws Exception {
        // Initialize the database
        channelRepository.saveAndFlush(channel);

        int databaseSizeBeforeUpdate = channelRepository.findAll().size();

        // Update the channel using partial update
        Channel partialUpdatedChannel = new Channel();
        partialUpdatedChannel.setId(channel.getId());

        partialUpdatedChannel.name(UPDATED_NAME).description(UPDATED_DESCRIPTION);

        restChannelMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedChannel.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedChannel))
            )
            .andExpect(status().isOk());

        // Validate the Channel in the database
        List<Channel> channelList = channelRepository.findAll();
        assertThat(channelList).hasSize(databaseSizeBeforeUpdate);
        Channel testChannel = channelList.get(channelList.size() - 1);
        assertThat(testChannel.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testChannel.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
    }

    @Test
    @Transactional
    void patchNonExistingChannel() throws Exception {
        int databaseSizeBeforeUpdate = channelRepository.findAll().size();
        channel.setId(count.incrementAndGet());

        // Create the Channel
        ChannelDTO channelDTO = channelMapper.toDto(channel);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restChannelMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, channelDTO.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(channelDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Channel in the database
        List<Channel> channelList = channelRepository.findAll();
        assertThat(channelList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchChannel() throws Exception {
        int databaseSizeBeforeUpdate = channelRepository.findAll().size();
        channel.setId(count.incrementAndGet());

        // Create the Channel
        ChannelDTO channelDTO = channelMapper.toDto(channel);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restChannelMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(channelDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Channel in the database
        List<Channel> channelList = channelRepository.findAll();
        assertThat(channelList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamChannel() throws Exception {
        int databaseSizeBeforeUpdate = channelRepository.findAll().size();
        channel.setId(count.incrementAndGet());

        // Create the Channel
        ChannelDTO channelDTO = channelMapper.toDto(channel);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restChannelMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(channelDTO))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Channel in the database
        List<Channel> channelList = channelRepository.findAll();
        assertThat(channelList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteChannel() throws Exception {
        // Initialize the database
        channelRepository.saveAndFlush(channel);

        int databaseSizeBeforeDelete = channelRepository.findAll().size();

        // Delete the channel
        restChannelMockMvc
            .perform(delete(ENTITY_API_URL_ID, channel.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Channel> channelList = channelRepository.findAll();
        assertThat(channelList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
